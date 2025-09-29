const express = require("express")
const cors = require("cors")
const fs = require("fs").promises
const path = require("path")
const { OAuth2Client } = require("google-auth-library")
const cookieParser = require("cookie-parser")

const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/auth/google/callback`

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Path to subscriptions data file
const SUBSCRIPTIONS_FILE = path.join(__dirname, "data", "subscriptions.json")

// Initialize subscriptions file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(SUBSCRIPTIONS_FILE)
  } catch (error) {
    await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify({ users: {} }, null, 2))
  }
}

// Read subscriptions data
async function readSubscriptions() {
  try {
    const data = await fs.readFile(SUBSCRIPTIONS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return { users: {} }
  }
}

// Write subscriptions data
async function writeSubscriptions(data) {
  await fs.writeFile(SUBSCRIPTIONS_FILE, JSON.stringify(data, null, 2))
}

// Google OAuth routes
app.get("/auth/google", (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  })
  res.redirect(authUrl)
})

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query
  try {
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    })

    const payload = ticket.getPayload()
    const userId = payload.sub

    // Initialize user data if doesn't exist
    const data = await readSubscriptions()
    if (!data.users[userId]) {
      data.users[userId] = {
        subscriptions: [],
        profile: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
        },
      }
      await writeSubscriptions(data)
    }

    // Set session cookie and redirect
    res.cookie("userId", userId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.redirect(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001")
  } catch (error) {
    console.error("Auth error:", error)
    res.redirect(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/auth?error=auth_failed`)
  }
})

app.post("/auth/logout", (req, res) => {
  res.clearCookie("userId")
  res.json({ success: true })
})

app.get("/api/user", async (req, res) => {
  const userId = req.cookies?.userId
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const data = await readSubscriptions()
    const userProfile = data.users[userId]?.profile
    if (userProfile) {
      res.json({
        id: userId,
        email: userProfile.email,
        name: userProfile.name,
        picture: userProfile.picture,
      })
    } else {
      res.status(404).json({ error: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user info" })
  }
})

// Middleware to check authentication
function requireAuth(req, res, next) {
  const userId = req.cookies?.userId
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  req.userId = userId
  next()
}

// Subscription CRUD routes
app.get("/api/subscriptions", requireAuth, async (req, res) => {
  try {
    const data = await readSubscriptions()
    const userSubscriptions = data.users[req.userId]?.subscriptions || []
    res.json(userSubscriptions)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscriptions" })
  }
})

app.post("/api/subscriptions", requireAuth, async (req, res) => {
  try {
    const { name, expiry, cost, notes, cycle } = req.body
    const data = await readSubscriptions()

    if (!data.users[req.userId]) {
      data.users[req.userId] = { subscriptions: [] }
    }

    const newSubscription = {
      id: Date.now().toString(),
      name,
      expiry,
      cost: Number.parseFloat(cost),
      notes,
      cycle,
      createdAt: new Date().toISOString(),
    }

    data.users[req.userId].subscriptions.push(newSubscription)
    await writeSubscriptions(data)

    res.json(newSubscription)
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription" })
  }
})

app.put("/api/subscriptions/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const { name, expiry, cost, notes, cycle } = req.body
    const data = await readSubscriptions()

    const userSubscriptions = data.users[req.userId]?.subscriptions || []
    const subscriptionIndex = userSubscriptions.findIndex((sub) => sub.id === id)

    if (subscriptionIndex === -1) {
      return res.status(404).json({ error: "Subscription not found" })
    }

    userSubscriptions[subscriptionIndex] = {
      ...userSubscriptions[subscriptionIndex],
      name,
      expiry,
      cost: Number.parseFloat(cost),
      notes,
      cycle,
      updatedAt: new Date().toISOString(),
    }

    await writeSubscriptions(data)
    res.json(userSubscriptions[subscriptionIndex])
  } catch (error) {
    res.status(500).json({ error: "Failed to update subscription" })
  }
})

app.delete("/api/subscriptions/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const data = await readSubscriptions()

    const userSubscriptions = data.users[req.userId]?.subscriptions || []
    const filteredSubscriptions = userSubscriptions.filter((sub) => sub.id !== id)

    data.users[req.userId].subscriptions = filteredSubscriptions
    await writeSubscriptions(data)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subscription" })
  }
})

// Initialize and start server
initializeDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
