'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Users, Mail, Crown, User, Eye } from 'lucide-react'
import { createTeam, getTeams, inviteTeamMember, updateTeamMember, removeTeamMember, Team, TeamMember } from '@/lib/auth'

export function TeamManagement() {
  
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [newTeamName, setNewTeamName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const teamsData = await getTeams()
      setTeams(teamsData)
    } catch (error) {
      console.error('Error loading teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return
    
    try {
      const newTeam = await createTeam(newTeamName)
      setTeams([...teams, newTeam])
      setNewTeamName('')
    } catch (error) {
      console.error('Error creating team:', error)
    }
  }

  const handleInviteMember = async (teamId: string) => {
    if (!inviteEmail.trim()) return
    
    try {
      await inviteTeamMember(teamId, inviteEmail, inviteRole)
      setInviteEmail('')
      setInviteRole('member')
      loadTeams() // Reload to get updated data
    } catch (error) {
      console.error('Error inviting member:', error)
    }
  }

  const handleUpdateMemberRole = async (teamId: string, userId: string, role: 'admin' | 'member' | 'viewer') => {
    try {
      await updateTeamMember(teamId, userId, role)
      loadTeams()
    } catch (error) {
      console.error('Error updating member role:', error)
    }
  }

  const handleRemoveMember = async (teamId: string, userId: string) => {
    try {
      await removeTeamMember(teamId, userId)
      loadTeams()
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4 text-yellow-500" />
      case 'member': return <User className="h-4 w-4 text-blue-500" />
      case 'viewer': return <Eye className="h-4 w-4 text-gray-500" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800'
      case 'member': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Team</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo Team Mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo Team Mới</DialogTitle>
              <DialogDescription>
                Tạo một team mới để chia sẻ và cộng tác quản lý subscription.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tên team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.targetvalue)}
              />
              <Button onClick={handleCreateTeam} className="w-full">
                Tạo Team
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {team.name}
                  </CardTitle>
                  <CardDescription>
                    {team.members.length} thành viên • Tạo ngày {new Date(team.createdAt).toLocaleDateString('vi-VN')}
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Mời thành viên
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Mời thành viên vào {team.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Email thành viên"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.targetvalue)}
                      />
                      <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={() => handleInviteMember(team.id)} 
                        className="w-full"
                      >
                        Gửi lời mời
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thành viên</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Ngày tham gia</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        User {member.userId}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {getRoleIcon(member.role)}
                          <span className="ml-1 capitalize">{member.role}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinedAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select
                            value={member.role}
                            onValueChange={(value: any) => 
                              handleUpdateMemberRole(team.id, member.userId, value)
                            }
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMember(team.id, member.userId)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có team nào</h3>
            <p className="text-gray-500 text-center mb-4">
              Tạo team đầu tiên để bắt đầu chia sẻ và cộng tác quản lý subscription.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}