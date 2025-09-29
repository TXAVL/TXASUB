# 🚀 TXA Modal - Enhanced JavaScript Modal System

## ✨ Tính năng nổi bật

### 🎨 **UI/UX Hiện đại**
- **Gradient Backgrounds**: Màu sắc gradient đẹp mắt
- **Glassmorphism Effect**: Hiệu ứng kính mờ với backdrop-filter
- **Smooth Animations**: Animation mượt mà với cubic-bezier
- **3D Transform**: Hiệu ứng 3D khi mở/đóng modal
- **Responsive Design**: Tự động adapt với mọi kích thước màn hình

### ⚡ **Tính năng nâng cao**
- **Async Operations**: Hỗ trợ thao tác bất đồng bộ với loading state
- **Progress Indicator**: Thanh tiến trình cho các thao tác dài
- **Custom Icons**: Icon emoji tùy chỉnh
- **Multiple Types**: Warning, Danger, Info, Success
- **Keyboard Support**: ESC để đóng modal
- **Dark Mode**: Tự động support dark mode

### 🔧 **API Methods**

#### Basic Methods
```javascript
// Confirm dialog
const result = await txaModal.confirm('Bạn có chắc chắn?');

// Alert dialog
await txaModal.alert('Thông báo quan trọng');

// Warning dialog
const result = await txaModal.warning('Cảnh báo!');

// Danger dialog
const result = await txaModal.danger('Nguy hiểm!');

// Success dialog
await txaModal.success('Thành công!');
```

#### Advanced Methods
```javascript
// Custom modal
const result = await txaModal.show({
    title: 'Custom Title',
    subtitle: 'Optional subtitle',
    message: 'Custom message',
    type: 'info', // warning, danger, info, success
    icon: '🎯', // Custom emoji
    confirmText: 'Custom OK',
    cancelText: 'Custom Cancel',
    allowOverlayClose: true, // Click outside to close
    showProgress: false
});

// Async operation with loading
const result = await txaModal.confirmAsync(
    'Thực hiện thao tác?',
    'Async Operation',
    async () => {
        // Your async operation
        await fetch('/api/data');
        return { success: true };
    }
);

// Progress modal
const modal = txaModal.progress('Đang xử lý...', 'Processing');
// Hide when done
txaModal.hide();
```

## 🎯 **Options Object**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | string | 'Xác nhận' | Tiêu đề modal |
| `subtitle` | string | '' | Phụ đề (optional) |
| `message` | string | 'Bạn có chắc chắn...' | Nội dung chính |
| `type` | string | 'warning' | Loại modal (warning, danger, info, success) |
| `icon` | string | Auto | Icon emoji tùy chỉnh |
| `confirmText` | string | 'Xác nhận' | Text nút confirm |
| `cancelText` | string\|null | 'Hủy' | Text nút cancel (null = ẩn) |
| `allowOverlayClose` | boolean | true | Cho phép click outside để đóng |
| `showProgress` | boolean | false | Hiển thị thanh progress |
| `async` | function | null | Function async để thực hiện |

## 🎨 **Styling & Themes**

### Color Schemes
- **Warning**: Orange gradient với icon ⚠️
- **Danger**: Red gradient với icon 🚨  
- **Info**: Blue gradient với icon ℹ️
- **Success**: Green gradient với icon ✅

### Responsive Breakpoints
```css
/* Mobile */
@media (max-width: 480px) {
    .txa-modal-confirm {
        margin: 20px;
        width: calc(100% - 40px);
    }
    
    .txa-modal-actions {
        flex-direction: column;
    }
}
```

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
    .txa-modal-confirm {
        background: linear-gradient(145deg, #2d3748, #1a202c);
        color: #e2e8f0;
    }
}
```

## 🚀 **Quick Start**

### 1. Include Script
```html
<script src="js/txa-modal.js"></script>
```

### 2. Basic Usage
```javascript
// Simple confirm
const result = await txaModal.confirm('Xóa item này?');
if (result) {
    // User confirmed
    deleteItem();
}
```

### 3. Advanced Usage
```javascript
// Custom modal with async operation
const result = await txaModal.show({
    title: 'Xóa dữ liệu',
    subtitle: 'Hành động này không thể hoàn tác',
    message: 'Bạn có chắc chắn muốn xóa tất cả dữ liệu?',
    type: 'danger',
    icon: '🗑️',
    confirmText: 'Xóa ngay',
    cancelText: 'Hủy bỏ',
    async: async () => {
        const response = await fetch('/api/delete-all', {
            method: 'DELETE'
        });
        return await response.json();
    }
});
```

## 📱 **Mobile Optimization**

- **Touch-friendly**: Buttons và spacing tối ưu cho mobile
- **Responsive Layout**: Tự động stack buttons trên mobile
- **Swipe Gestures**: Có thể thêm swipe để đóng (future feature)
- **Viewport Safe**: Không bị che bởi keyboard trên mobile

## 🔧 **Customization**

### Custom CSS Variables
```css
:root {
    --txa-modal-border-radius: 20px;
    --txa-modal-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    --txa-modal-backdrop-blur: 8px;
}
```

### Custom Animations
```css
.txa-modal-confirm {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🐛 **Browser Support**

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 📦 **File Structure**

```
public/
├── js/
│   └── txa-modal.js          # Main modal script
├── modal-demo.html           # Demo page
└── MODAL_README.md           # This documentation
```

## 🎯 **Best Practices**

### 1. **Error Handling**
```javascript
try {
    const result = await txaModal.confirmAsync(
        'Thực hiện thao tác?',
        'Confirm',
        async () => {
            const response = await fetch('/api/data');
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        }
    );
} catch (error) {
    await txaModal.alert('Có lỗi xảy ra: ' + error.message);
}
```

### 2. **Progressive Enhancement**
```javascript
// Check if modal is available
if (typeof txaModal !== 'undefined') {
    const result = await txaModal.confirm('Xóa item?');
} else {
    // Fallback to native confirm
    const result = confirm('Xóa item?');
}
```

### 3. **Accessibility**
- Modal tự động focus vào nút confirm
- ESC key để đóng modal
- ARIA labels cho screen readers
- High contrast colors

## 🔮 **Future Features**

- [ ] **Swipe Gestures**: Swipe để đóng modal trên mobile
- [ ] **Sound Effects**: Âm thanh khi mở/đóng modal
- [ ] **Themes**: Multiple color themes
- [ ] **Animations**: More animation options
- [ ] **Stacking**: Multiple modals support
- [ ] **Auto-close**: Timer để tự động đóng modal

## 📞 **Support**

Nếu bạn gặp vấn đề hoặc có góp ý, vui lòng tạo issue hoặc liên hệ qua:
- Email: support@txa.com
- GitHub: [TXA Modal Repository]

---

**Made with ❤️ by TXA Team**