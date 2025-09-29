class TXAModal {
    constructor() {
        this.modalOverlay = null;
        this.modalConfirm = null;
        this.isInitialized = false;
        this.animationDuration = 300;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Đợi DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createModalHTML();
                this.bindEvents();
                this.isInitialized = true;
            });
        } else {
            this.createModalHTML();
            this.bindEvents();
            this.isInitialized = true;
        }
    }

    createModalHTML() {
        // Kiểm tra xem modal đã tồn tại chưa
        if (document.getElementById('txaModalOverlay')) return;

        // Kiểm tra document.body có tồn tại không
        if (!document.body) {
            console.warn('TXA Modal: document.body not ready, retrying...');
            setTimeout(() => this.createModalHTML(), 100);
            return;
        }

        const modalHTML = `
            <div class="txa-modal-overlay" id="txaModalOverlay">
                <div class="txa-modal-confirm" id="txaModalConfirm">
                    <div class="txa-modal-header">
                        <div class="txa-modal-icon-container">
                            <div class="txa-modal-icon" id="txaModalIcon">
                                <div class="txa-modal-icon-inner">
                                    <span class="txa-modal-icon-emoji" id="txaModalIconEmoji">⚠</span>
                                </div>
                            </div>
                        </div>
                        <div class="txa-modal-title-container">
                            <h3 class="txa-modal-title" id="txaModalTitle">Xác nhận</h3>
                            <div class="txa-modal-subtitle" id="txaModalSubtitle"></div>
                        </div>
                    </div>
                    <div class="txa-modal-content">
                        <p class="txa-modal-message" id="txaModalMessage">Bạn có chắc chắn muốn thực hiện hành động này?</p>
                        <div class="txa-modal-progress" id="txaModalProgress" style="display: none;">
                            <div class="txa-modal-progress-bar">
                                <div class="txa-modal-progress-fill"></div>
                            </div>
                            <div class="txa-modal-progress-text">Đang xử lý...</div>
                        </div>
                    </div>
                    <div class="txa-modal-actions" id="txaModalActions">
                        <button class="txa-modal-btn txa-modal-btn-cancel" id="txaModalCancel">
                            <span class="txa-modal-btn-text">Hủy</span>
                        </button>
                        <button class="txa-modal-btn txa-modal-btn-confirm" id="txaModalConfirmBtn">
                            <span class="txa-modal-btn-text">Xác nhận</span>
                            <div class="txa-modal-btn-loading" style="display: none;">
                                <div class="txa-modal-spinner"></div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Thêm CSS nếu chưa có
        this.addModalCSS();
        
        try {
            // Thêm HTML vào body
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            // Lưu reference
            this.modalOverlay = document.getElementById('txaModalOverlay');
            this.modalConfirm = document.getElementById('txaModalConfirm');
        } catch (error) {
            console.error('TXA Modal: Error creating modal HTML:', error);
        }
    }

    addModalCSS() {
        if (document.getElementById('txa-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'txa-modal-styles';
        style.textContent = `
            /* TXA Modal System - Enhanced Version */
            .txa-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            }
            
            .txa-modal-overlay.show {
                opacity: 1;
                visibility: visible;
            }
            
            .txa-modal-confirm {
                background: linear-gradient(145deg, #ffffff, #f8f9fa);
                border-radius: 20px;
                padding: 0;
                max-width: 450px;
                width: 90%;
                box-shadow: 
                    0 25px 50px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
                transform: scale(0.8) translateY(30px) rotateX(10deg);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                overflow: hidden;
                position: relative;
            }
            
            .txa-modal-overlay.show .txa-modal-confirm {
                transform: scale(1) translateY(0) rotateX(0deg);
            }
            
            .txa-modal-confirm::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px 20px 0 0;
            }
            
            .txa-modal-header {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                padding: 24px 24px 16px 24px;
                position: relative;
            }
            
            .txa-modal-icon-container {
                flex-shrink: 0;
            }
            
            .txa-modal-icon {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all 0.3s ease;
            }
            
            .txa-modal-icon-inner {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }
            
            .txa-modal-icon.warning {
                background: linear-gradient(135deg, #ff9800, #ff5722);
                box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
            }
            
            .txa-modal-icon.danger {
                background: linear-gradient(135deg, #f44336, #d32f2f);
                box-shadow: 0 8px 20px rgba(244, 67, 54, 0.3);
            }
            
            .txa-modal-icon.info {
                background: linear-gradient(135deg, #2196f3, #1976d2);
                box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
            }
            
            .txa-modal-icon.success {
                background: linear-gradient(135deg, #4caf50, #388e3c);
                box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
            }
            
            .txa-modal-icon-emoji {
                font-size: 20px;
                color: white;
                font-weight: bold;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }
            
            .txa-modal-title-container {
                flex: 1;
                min-width: 0;
            }
            
            .txa-modal-title {
                font-size: 20px;
                font-weight: 700;
                color: #1a1a1a;
                margin: 0 0 4px 0;
                line-height: 1.3;
            }
            
            .txa-modal-subtitle {
                font-size: 14px;
                color: #666;
                font-weight: 400;
                line-height: 1.4;
            }
            
            .txa-modal-content {
                padding: 0 24px 16px 24px;
            }
            
            .txa-modal-message {
                font-size: 15px;
                color: #4a4a4a;
                line-height: 1.6;
                margin: 0;
                font-weight: 400;
            }
            
            .txa-modal-progress {
                margin-top: 16px;
            }
            
            .txa-modal-progress-bar {
                width: 100%;
                height: 4px;
                background: #e0e0e0;
                border-radius: 2px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            
            .txa-modal-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 2px;
                width: 0%;
                transition: width 0.3s ease;
                animation: progress-shimmer 2s infinite;
            }
            
            @keyframes progress-shimmer {
                0% { background-position: -200px 0; }
                100% { background-position: calc(200px + 100%) 0; }
            }
            
            .txa-modal-progress-text {
                font-size: 13px;
                color: #666;
                text-align: center;
            }
            
            .txa-modal-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                padding: 16px 24px 24px 24px;
                background: #f8f9fa;
                border-top: 1px solid #e9ecef;
            }
            
            .txa-modal-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                min-width: 100px;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .txa-modal-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transition: left 0.5s ease;
            }
            
            .txa-modal-btn:hover::before {
                left: 100%;
            }
            
            .txa-modal-btn-cancel {
                background: #f8f9fa;
                color: #6c757d;
                border: 1px solid #dee2e6;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            
            .txa-modal-btn-cancel:hover {
                background: #e9ecef;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            .txa-modal-btn-confirm {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            
            .txa-modal-btn-confirm:hover {
                background: linear-gradient(135deg, #5a6fd8, #6a4190);
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
            }
            
            .txa-modal-btn-danger {
                background: linear-gradient(135deg, #f44336, #d32f2f);
                color: white;
                box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
            }
            
            .txa-modal-btn-danger:hover {
                background: linear-gradient(135deg, #e53935, #c62828);
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(244, 67, 54, 0.4);
            }
            
            .txa-modal-btn-success {
                background: linear-gradient(135deg, #4caf50, #388e3c);
                color: white;
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            }
            
            .txa-modal-btn-success:hover {
                background: linear-gradient(135deg, #45a049, #2e7d32);
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
            }
            
            .txa-modal-btn:active {
                transform: translateY(0);
            }
            
            .txa-modal-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .txa-modal-btn-text {
                transition: opacity 0.2s ease;
            }
            
            .txa-modal-btn-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .txa-modal-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Responsive */
            @media (max-width: 480px) {
                .txa-modal-confirm {
                    margin: 20px;
                    width: calc(100% - 40px);
                    max-width: none;
                }
                
                .txa-modal-actions {
                    flex-direction: column;
                }
                
                .txa-modal-btn {
                    width: 100%;
                }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .txa-modal-confirm {
                    background: linear-gradient(145deg, #2d3748, #1a202c);
                    color: #e2e8f0;
                }
                
                .txa-modal-title {
                    color: #f7fafc;
                }
                
                .txa-modal-message {
                    color: #cbd5e0;
                }
                
                .txa-modal-actions {
                    background: #2d3748;
                    border-top-color: #4a5568;
                }
                
                .txa-modal-btn-cancel {
                    background: #4a5568;
                    color: #e2e8f0;
                    border-color: #718096;
                }
                
                .txa-modal-btn-cancel:hover {
                    background: #718096;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    bindEvents() {
        // ESC key để đóng modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay && this.modalOverlay.classList.contains('show')) {
                this.hide();
            }
        });
    }

    show(options = {}) {
        return new Promise((resolve) => {
            // Đảm bảo modal đã được tạo
            if (!this.modalOverlay || !this.modalConfirm) {
                console.warn('TXA Modal: Modal not initialized, initializing...');
                this.createModalHTML();
                // Đợi một chút để DOM được cập nhật
                setTimeout(() => this.show(options).then(resolve), 50);
                return;
            }

            const icon = document.getElementById('txaModalIcon');
            const iconEmoji = document.getElementById('txaModalIconEmoji');
            const title = document.getElementById('txaModalTitle');
            const subtitle = document.getElementById('txaModalSubtitle');
            const message = document.getElementById('txaModalMessage');
            const progress = document.getElementById('txaModalProgress');
            const actions = document.getElementById('txaModalActions');
            const cancelBtn = document.getElementById('txaModalCancel');
            const confirmBtn = document.getElementById('txaModalConfirmBtn');

            // Kiểm tra các elements có tồn tại không
            if (!icon || !title || !message || !cancelBtn || !confirmBtn) {
                console.error('TXA Modal: Required elements not found');
                resolve(false);
                return;
            }
            
            // Set content
            title.textContent = options.title || 'Xác nhận';
            message.textContent = options.message || 'Bạn có chắc chắn muốn thực hiện hành động này?';
            
            // Set subtitle if provided
            if (subtitle) {
                subtitle.textContent = options.subtitle || '';
                subtitle.style.display = options.subtitle ? 'block' : 'none';
            }
            
            // Set icon and style
            const iconClass = options.type || 'warning';
            icon.className = `txa-modal-icon ${iconClass}`;
            iconEmoji.textContent = options.icon || this.getDefaultIcon(iconClass);
            
            // Set button text and style
            const cancelText = options.cancelText;
            const confirmText = options.confirmText;
            
            if (cancelText === null || cancelText === false) {
                cancelBtn.style.display = 'none';
            } else {
                cancelBtn.style.display = 'flex';
                cancelBtn.querySelector('.txa-modal-btn-text').textContent = cancelText || 'Hủy';
            }
            
            confirmBtn.querySelector('.txa-modal-btn-text').textContent = confirmText || 'Xác nhận';
            confirmBtn.className = `txa-modal-btn txa-modal-btn-${this.getButtonClass(iconClass)}`;
            
            // Show/hide progress if needed
            if (progress) {
                progress.style.display = options.showProgress ? 'block' : 'none';
            }
            
            // Show modal with animation
            this.modalOverlay.classList.add('show');
            
            // Event handlers
            const handleCancel = () => {
                this.hide();
                resolve(false);
            };
            
            const handleConfirm = () => {
                if (options.async) {
                    this.showLoading(confirmBtn);
                    options.async().then((result) => {
                        this.hideLoading(confirmBtn);
                        this.hide();
                        resolve(result);
                    }).catch((error) => {
                        this.hideLoading(confirmBtn);
                        console.error('TXA Modal: Async operation failed:', error);
                        resolve(false);
                    });
                } else {
                    this.hide();
                    resolve(true);
                }
            };
            
            const handleOverlayClick = (e) => {
                if (e.target === this.modalOverlay && options.allowOverlayClose !== false) {
                    handleCancel();
                }
            };
            
            // Add event listeners
            cancelBtn.addEventListener('click', handleCancel);
            confirmBtn.addEventListener('click', handleConfirm);
            this.modalOverlay.addEventListener('click', handleOverlayClick);
            
            // Store handlers for cleanup
            this.currentHandlers = { handleCancel, handleConfirm, handleOverlayClick };
        });
    }

    showLoading(button) {
        const text = button.querySelector('.txa-modal-btn-text');
        const loading = button.querySelector('.txa-modal-btn-loading');
        
        if (text && loading) {
            text.style.opacity = '0';
            loading.style.display = 'block';
            button.disabled = true;
        }
    }

    hideLoading(button) {
        const text = button.querySelector('.txa-modal-btn-text');
        const loading = button.querySelector('.txa-modal-btn-loading');
        
        if (text && loading) {
            text.style.opacity = '1';
            loading.style.display = 'none';
            button.disabled = false;
        }
    }

    hide() {
        if (!this.modalOverlay) {
            console.warn('TXA Modal: Modal overlay not found');
            return;
        }

        this.modalOverlay.classList.remove('show');
        
        // Cleanup event listeners
        if (this.currentHandlers) {
            const cancelBtn = document.getElementById('txaModalCancel');
            const confirmBtn = document.getElementById('txaModalConfirmBtn');
            
            if (cancelBtn) {
                cancelBtn.removeEventListener('click', this.currentHandlers.handleCancel);
            }
            if (confirmBtn) {
                confirmBtn.removeEventListener('click', this.currentHandlers.handleConfirm);
            }
            if (this.modalOverlay) {
                this.modalOverlay.removeEventListener('click', this.currentHandlers.handleOverlayClick);
            }
            
            this.currentHandlers = null;
        }
    }

    getDefaultIcon(type) {
        const icons = {
            warning: '⚠️',
            danger: '🚨',
            info: 'ℹ️',
            success: '✅'
        };
        return icons[type] || '⚠️';
    }

    getButtonClass(type) {
        const buttonClasses = {
            danger: 'danger',
            success: 'success',
            warning: 'confirm',
            info: 'confirm'
        };
        return buttonClasses[type] || 'confirm';
    }

    // Convenience methods
    confirm(message, title = 'Xác nhận', options = {}) {
        return this.show({
            title,
            message,
            type: 'warning',
            ...options
        });
    }

    alert(message, title = 'Thông báo', options = {}) {
        return this.show({
            title,
            message,
            type: 'info',
            confirmText: 'OK',
            cancelText: null,
            ...options
        });
    }

    warning(message, title = 'Cảnh báo', options = {}) {
        return this.show({
            title,
            message,
            type: 'warning',
            ...options
        });
    }

    danger(message, title = 'Nguy hiểm', options = {}) {
        return this.show({
            title,
            message,
            type: 'danger',
            confirmText: 'Xóa',
            cancelText: 'Hủy',
            ...options
        });
    }

    success(message, title = 'Thành công', options = {}) {
        return this.show({
            title,
            message,
            type: 'success',
            confirmText: 'OK',
            cancelText: null,
            ...options
        });
    }

    // Advanced methods
    async confirmAsync(message, title = 'Xác nhận', asyncFunction) {
        return this.show({
            title,
            message,
            type: 'warning',
            async: asyncFunction
        });
    }

    progress(message, title = 'Đang xử lý...') {
        return this.show({
            title,
            message,
            type: 'info',
            showProgress: true,
            confirmText: null,
            cancelText: null,
            allowOverlayClose: false
        });
    }
}

// Export cho global use - chỉ export nếu chưa có
if (typeof window !== 'undefined' && !window.TXAModal) {
  window.TXAModal = TXAModal;
}

// Tạo instance mặc định - chỉ tạo nếu chưa có
if (typeof window !== 'undefined' && !window.txaModal) {
  window.txaModal = new TXAModal();
}

// Export cho module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TXAModal;
}