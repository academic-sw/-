/**
 * ==========================================================================
 * ระบบสารสนเทศงานวัดและประเมินผล โรงเรียนเสาไห้ "วิมลวิทยานุกูล"
 * Single Page Application Logic & LocalStorage / Google Sheets Data Engine
 * ==========================================================================
 */

// Global Application State & Constants
const STORAGE_KEYS = {
    NEWS: 'sh_wimon_eval_news_v1',
    SYSTEMS: 'sh_wimon_eval_systems_v1',
    THEME: 'sh_wimon_eval_theme_v1',
    LOGO: 'sh_wimon_eval_logo_v1',
    AUTH: 'sh_wimon_eval_auth_v1',
    GS_URL: 'sh_wimon_eval_gs_url_v1'
};

// Default Initial Seed Data (โรงเรียนเสาไห้ "วิมลวิทยานุกูล")
const DEFAULT_NEWS = [
    {
        id: 'news_1',
        title: 'ประกาศกำหนดการส่งผลการเรียนปลายภาคเรียน และการอนุมัติผลการเรียน ปีการศึกษา 2569',
        category: 'ประกาศสำคัญ',
        content: `งานวัดและประเมินผล โรงเรียนเสาไห้ "วิมลวิทยานุกูล" ขอแจ้งกำหนดการส่งผลการเรียนปลายภาคให้ครูผู้สอนทุกกลุ่มสาระการเรียนรู้ดำเนินการดังนี้:

1. บันทึกคะแนนเก็บและคะแนนสอบปลายภาคลงในระบบ SGS ให้เรียบร้อยภายในวันที่ 20 ตุลาคม
2. ตรวจสอบความถูกต้องของคะแนน คุณลักษณะอันพึงประสงค์ และอ่านคิดวิเคราะห์
3. พิมพ์แบบส่งผลการเรียน (ปพ.5) นำส่งงานวัดผลเพื่อเสนออนุมัติผลการเรียนตามลำดับ

ขอความร่วมมือคุณครูทุกท่านดำเนินการตามปฏิทินที่กำหนด`,
        date: '2026-09-25 09:30',
        file1Name: 'ปฏิทินการส่งผลการเรียน.pdf',
        file1Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file2Name: 'แบบฟอร์มขอแก้ไขผลการเรียน (ปพ.08).pdf',
        file2Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file3Name: 'คู่มือการใช้งานระบบ SGS สำหรับครู.pdf',
        file3Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        images: [
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        id: 'news_2',
        title: 'แนวทางการลงทะเบียนแก้ผลการเรียน "0, ร, มส" ประจำภาคเรียนที่ 1',
        category: 'การประเมินผล',
        content: `นักเรียนโรงเรียนเสาไห้ "วิมลวิทยานุกูล" ที่มีผลการเรียนไม่สมบูรณ์ (0, ร, มส) สามารถยื่นคำร้องขอสอบซ่อมและปรับปรุงผลการเรียนตามขั้นตอนดังนี้:

- ติดต่อครูผู้สอนประจำวิชาเพื่อรับมอบหมายงานซ่อมตัวชี้วัด
- ยื่นคำร้องผ่านงานวัดและประเมินผล อาคารเรียนวิชาการ
- ดำเนินการแก้ผลการเรียนให้เสร็จสิ้นภายในระยะเวลาที่กำหนด`,
        date: '2026-09-20 14:15',
        file1Name: 'คำร้องขอซ่อมตัวชี้วัด.pdf',
        file1Url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file2Name: '',
        file2Url: '',
        file3Name: '',
        file3Url: '',
        images: [
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
        ]
    }
];

const DEFAULT_SYSTEMS = [
    {
        id: 'sys_1',
        title: 'ระบบ SGS ประเมินผลการเรียน',
        url: 'https://sgs.bopp-obec.info/',
        icon: 'fa-graduation-cap',
        category: 'ระบบประเมินผล',
        orderIndex: 1
    },
    {
        id: 'sys_2',
        title: 'ระบบตรวจสอบผลสอบออนไลน์',
        url: 'https://wikipedia.org',
        icon: 'fa-clipboard-check',
        category: 'ตรวจสอบผลสอบ',
        orderIndex: 2
    },
    {
        id: 'sys_3',
        title: 'ระบบบันทึกแผนการจัดกิจกรรม',
        url: 'https://example.com',
        icon: 'fa-file-signature',
        category: 'งานวิชาการ',
        orderIndex: 3
    }
];

const DEFAULT_THEME = {
    mode: 'light',
    primaryColor: '#2E7D32',
    sidebarColor: '#F4F8F5',
    textColor: '#1E293B',
    footerText: 'พัฒนาโดย งานวัดและประเมินผล โรงเรียนเสาไห้ "วิมลวิทยานุกูล"'
};

// Application Main Class
class EvaluationSystemApp {
    constructor() {
        this.news = [];
        this.systems = [];
        this.theme = { ...DEFAULT_THEME };
        this.logo = null;
        this.gsUrl = '';
        this.isAdmin = false;
        this.activeTab = 'home';
        this.activeSystem = null;

        this.init();
    }

    async init() {
        this.loadState();
        this.setupDOM();
        this.bindEvents();
        this.applyTheme();
        this.renderAll();

        // Update year in footer
        const yearElem = document.getElementById('currentYear');
        if (yearElem) yearElem.textContent = new Date().getFullYear() + 543;

        // Auto fetch from Google Sheet if URL exists
        if (this.gsUrl) {
            await this.fetchFromGoogleSheet();
        }
    }

    // ----------------------------------------------------------------------
    // 1. STATE MANAGEMENT & LOCAL STORAGE
    // ----------------------------------------------------------------------
    loadState() {
        // Load News
        const newsData = localStorage.getItem(STORAGE_KEYS.NEWS);
        this.news = newsData ? JSON.parse(newsData) : [...DEFAULT_NEWS];

        // Load Sub-systems
        const systemsData = localStorage.getItem(STORAGE_KEYS.SYSTEMS);
        this.systems = systemsData ? JSON.parse(systemsData) : [...DEFAULT_SYSTEMS];
        this.systems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

        // Load Theme
        const themeData = localStorage.getItem(STORAGE_KEYS.THEME);
        this.theme = themeData ? { ...DEFAULT_THEME, ...JSON.parse(themeData) } : { ...DEFAULT_THEME };

        // Load Logo
        this.logo = localStorage.getItem(STORAGE_KEYS.LOGO) || null;

        // Load Google Sheets Web App URL
        this.gsUrl = localStorage.getItem(STORAGE_KEYS.GS_URL) || '';

        // Load Auth State
        this.isAdmin = localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    }

    saveNewsState() {
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(this.news));
        this.autoSyncGoogleSheet();
    }

    saveSystemsState() {
        this.systems.forEach((sys, idx) => sys.orderIndex = idx + 1);
        localStorage.setItem(STORAGE_KEYS.SYSTEMS, JSON.stringify(this.systems));
        this.autoSyncGoogleSheet();
    }

    saveThemeState() {
        localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(this.theme));
        this.autoSyncGoogleSheet();
    }

    saveLogoState() {
        if (this.logo) {
            localStorage.setItem(STORAGE_KEYS.LOGO, this.logo);
        } else {
            localStorage.removeItem(STORAGE_KEYS.LOGO);
        }
        this.autoSyncGoogleSheet();
    }

    saveAuthState() {
        localStorage.setItem(STORAGE_KEYS.AUTH, this.isAdmin ? 'true' : 'false');
    }

    // ----------------------------------------------------------------------
    // 2. GOOGLE SHEETS SYNC ENGINE
    // ----------------------------------------------------------------------
    async autoSyncGoogleSheet() {
        if (!this.gsUrl) return;

        try {
            const payload = {
                action: 'syncAll',
                news: this.news,
                systems: this.systems,
                theme: this.theme,
                logo: this.logo
            };

            await fetch(this.gsUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log('Synced with Google Sheets via no-cors');
        } catch (err) {
            console.error('Error auto syncing with Google Sheets:', err);
        }
    }

    async fetchFromGoogleSheet() {
        if (!this.gsUrl) return;

        this.showSpinner('กำลังดึงข้อมูลจาก Google Sheet...');
        try {
            const response = await fetch(`${this.gsUrl}?action=getAll`);
            const data = await response.json();

            if (data && data.success) {
                if (data.news && data.news.length > 0) {
                    this.news = data.news;
                    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(this.news));
                }
                if (data.systems && data.systems.length > 0) {
                    this.systems = data.systems;
                    this.systems.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
                    localStorage.setItem(STORAGE_KEYS.SYSTEMS, JSON.stringify(this.systems));
                }
                if (data.settings && data.settings.theme) {
                    this.theme = { ...DEFAULT_THEME, ...data.settings.theme };
                    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(this.theme));
                }
                if (data.settings && data.settings.logo) {
                    this.logo = data.settings.logo;
                    localStorage.setItem(STORAGE_KEYS.LOGO, this.logo);
                }

                this.applyTheme();
                this.renderAll();
                this.showToast('success', 'ซิงค์ข้อมูลจาก Google Sheet เรียบร้อยแล้ว');
            }
        } catch (err) {
            console.warn('Could not fetch directly from Google Sheet (might require WebApp deployment):', err);
        } finally {
            this.hideSpinner();
        }
    }

    // ----------------------------------------------------------------------
    // 3. DOM ELEMENTS & EVENT BINDINGS
    // ----------------------------------------------------------------------
    setupDOM() {
        this.dom = {
            // Theme & Auth Controls
            themeToggleBtn: document.getElementById('themeToggleBtn'),
            themeIcon: document.getElementById('themeIcon'),
            authBtn: document.getElementById('authBtn'),
            authIcon: document.getElementById('authIcon'),
            authText: document.getElementById('authText'),
            adminBadge: document.getElementById('adminBadge'),
            userGuideBtn: document.getElementById('userGuideBtn'),
            heroGuideBtn: document.getElementById('heroGuideBtn'),
            adminThemeBtn: document.getElementById('adminThemeBtn'),
            mobileMenuBtn: document.getElementById('mobileMenuBtn'),
            sidebarLeft: document.getElementById('sidebarLeft'),
            sidebarCloseMobile: document.getElementById('sidebarCloseMobile'),
            sidebarOverlay: document.getElementById('sidebarOverlay'),
            appLogo: document.getElementById('appLogo'),

            // Views
            viewHome: document.getElementById('viewHome'),
            viewSystem: document.getElementById('viewSystem'),

            // Left Navigation Lists
            dynamicNavList: document.getElementById('dynamicNavList'),
            manageSystemsBtn: document.getElementById('manageSystemsBtn'),
            changeLogoBtn: document.getElementById('changeLogoBtn'),

            // News Feed Elements
            newsContainer: document.getElementById('newsContainer'),
            addNewsBtn: document.getElementById('addNewsBtn'),
            addNewsQuickBtn: document.getElementById('addNewsQuickBtn'),

            // Embedded Iframe Viewer Elements
            activeSystemIcon: document.getElementById('activeSystemIcon'),
            activeSystemTitle: document.getElementById('activeSystemTitle'),
            activeSystemCategory: document.getElementById('activeSystemCategory'),
            openExternalBtn: document.getElementById('openExternalBtn'),
            reloadFrameBtn: document.getElementById('reloadFrameBtn'),
            fullscreenFrameBtn: document.getElementById('fullscreenFrameBtn'),
            systemIframe: document.getElementById('systemIframe'),
            iframeLoader: document.getElementById('iframeLoader'),
            fallbackExternalLink: document.getElementById('fallbackExternalLink'),

            // Footer
            footerDevText: document.getElementById('footerDevText'),

            // Modals & Forms
            loginModal: document.getElementById('loginModal'),
            loginForm: document.getElementById('loginForm'),
            loginUsername: document.getElementById('loginUsername'),
            loginPassword: document.getElementById('loginPassword'),

            userGuideModal: document.getElementById('userGuideModal'),

            newsModal: document.getElementById('newsModal'),
            newsForm: document.getElementById('newsForm'),
            newsModalTitle: document.getElementById('newsModalTitle'),
            newsId: document.getElementById('newsId'),
            newsTitle: document.getElementById('newsTitle'),
            newsCategory: document.getElementById('newsCategory'),
            newsContent: document.getElementById('newsContent'),
            file1Name: document.getElementById('file1Name'),
            file1Url: document.getElementById('file1Url'),
            file2Name: document.getElementById('file2Name'),
            file2Url: document.getElementById('file2Url'),
            file3Name: document.getElementById('file3Name'),
            file3Url: document.getElementById('file3Url'),
            newsImages: document.getElementById('newsImages'),
            newsImageFiles: document.getElementById('newsImageFiles'),
            imagePreviewGrid: document.getElementById('imagePreviewGrid'),

            manageSystemsModal: document.getElementById('manageSystemsModal'),
            systemForm: document.getElementById('systemForm'),
            systemFormId: document.getElementById('systemFormId'),
            sysTitle: document.getElementById('sysTitle'),
            sysUrl: document.getElementById('sysUrl'),
            sysIcon: document.getElementById('sysIcon'),
            systemsTableBody: document.getElementById('systemsTableBody'),
            cancelEditSysBtn: document.getElementById('cancelEditSysBtn'),
            saveSysBtn: document.getElementById('saveSysBtn'),

            themeSettingsModal: document.getElementById('themeSettingsModal'),
            themeSettingsForm: document.getElementById('themeSettingsForm'),
            primaryColorPicker: document.getElementById('primaryColorPicker'),
            sidebarColorPicker: document.getElementById('sidebarColorPicker'),
            textColorPicker: document.getElementById('textColorPicker'),
            footerTextInput: document.getElementById('footerTextInput'),
            resetThemeBtn: document.getElementById('resetThemeBtn'),

            logoModal: document.getElementById('logoModal'),
            logoForm: document.getElementById('logoForm'),
            logoFileInput: document.getElementById('logoFileInput'),
            logoUrlInput: document.getElementById('logoUrlInput'),
            logoPreviewImg: document.getElementById('logoPreviewImg'),

            // Google Sheets Modal
            gsBtn: document.getElementById('gsBtn'),
            gsModal: document.getElementById('gsModal'),
            gsForm: document.getElementById('gsForm'),
            gsUrlInput: document.getElementById('gsUrlInput'),
            manualSyncGsBtn: document.getElementById('manualSyncGsBtn'),

            imageLightboxModal: document.getElementById('imageLightboxModal'),
            lightboxMainImg: document.getElementById('lightboxMainImg'),
            lightboxThumbs: document.getElementById('lightboxThumbs'),

            // Loading Overlay
            loadingOverlay: document.getElementById('loadingOverlay'),
            loadingText: document.getElementById('loadingText')
        };
    }

    bindEvents() {
        // Theme Dark/Light Toggle
        this.dom.themeToggleBtn.addEventListener('click', () => {
            this.theme.mode = this.theme.mode === 'dark' ? 'light' : 'dark';
            this.applyTheme();
            this.saveThemeState();
            this.showToast('info', `เปลี่ยนเป็น${this.theme.mode === 'dark' ? 'โหมดมืด' : 'โหมดสว่าง'}เรียบร้อย`);
        });

        // User Guide Modal
        const openGuide = () => this.openModal(this.dom.userGuideModal);
        this.dom.userGuideBtn.addEventListener('click', openGuide);
        if (this.dom.heroGuideBtn) this.dom.heroGuideBtn.addEventListener('click', openGuide);

        // Google Sheets Integration Modal
        if (this.dom.gsBtn) {
            this.dom.gsBtn.addEventListener('click', () => {
                this.dom.gsUrlInput.value = this.gsUrl;
                this.openModal(this.dom.gsModal);
            });
        }

        this.dom.gsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.gsUrl = this.dom.gsUrlInput.value.trim();
            localStorage.setItem(STORAGE_KEYS.GS_URL, this.gsUrl);
            this.closeModal(this.dom.gsModal);
            this.showToast('success', 'บันทึกการเชื่อมต่อ Google Sheet แล้ว');
            if (this.gsUrl) {
                await this.autoSyncGoogleSheet();
            }
        });

        this.dom.manualSyncGsBtn.addEventListener('click', async () => {
            this.gsUrl = this.dom.gsUrlInput.value.trim();
            if (!this.gsUrl) {
                alert('กรุณากรอก Web App URL ของ Google Apps Script ก่อนครับ');
                return;
            }
            localStorage.setItem(STORAGE_KEYS.GS_URL, this.gsUrl);
            this.showSpinner('กำลังส่งซิงค์ข้อมูลไปยัง Google Sheet...');
            await this.autoSyncGoogleSheet();
            this.hideSpinner();
            this.showToast('success', 'ส่งข้อมูลไปยัง Google Sheet สำเร็จแล้ว');
        });

        // Auth Login/Logout Trigger
        this.dom.authBtn.addEventListener('click', () => {
            if (this.isAdmin) {
                this.handleLogout();
            } else {
                this.openModal(this.dom.loginModal);
            }
        });

        // Login Form Submit
        this.dom.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Mobile Menu Drawer
        this.dom.mobileMenuBtn.addEventListener('click', () => {
            this.dom.sidebarLeft.classList.add('mobile-open');
            this.dom.sidebarOverlay.classList.add('active');
        });

        const closeMobileSidebar = () => {
            this.dom.sidebarLeft.classList.remove('mobile-open');
            this.dom.sidebarOverlay.classList.remove('active');
        };

        this.dom.sidebarCloseMobile.addEventListener('click', closeMobileSidebar);
        this.dom.sidebarOverlay.addEventListener('click', closeMobileSidebar);

        // Fixed Home Nav Link
        document.querySelector('[data-tab="home"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToHomeTab();
            closeMobileSidebar();
        });

        // News Add / Edit Modals
        if (this.dom.addNewsBtn) this.dom.addNewsBtn.addEventListener('click', () => this.openNewsModal());
        if (this.dom.addNewsQuickBtn) this.dom.addNewsQuickBtn.addEventListener('click', () => this.openNewsModal());
        this.dom.newsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveNews();
        });

        // Handle Image File Selection for News Form
        this.dom.newsImageFiles.addEventListener('change', (e) => {
            this.handleImageFilesPreview(e.target.files);
        });

        // Sub-systems Manager Modals (Admin Only)
        this.dom.manageSystemsBtn.addEventListener('click', () => {
            this.renderSystemsTable();
            this.openModal(this.dom.manageSystemsModal);
        });

        this.dom.systemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveSubSystem();
        });

        this.dom.cancelEditSysBtn.addEventListener('click', () => {
            this.resetSubSystemForm();
        });

        // Logo Upload Modal
        this.dom.changeLogoBtn.addEventListener('click', () => {
            this.dom.logoPreviewImg.src = this.logo || this.dom.appLogo.src;
            this.dom.logoPreviewImg.classList.remove('hidden');
            this.openModal(this.dom.logoModal);
        });

        this.dom.logoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSaveLogo();
        });

        this.dom.logoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    this.dom.logoPreviewImg.src = evt.target.result;
                    this.dom.logoPreviewImg.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        // Admin Theme Customizer Modal
        this.dom.adminThemeBtn.addEventListener('click', () => {
            this.dom.primaryColorPicker.value = this.theme.primaryColor || '#2E7D32';
            this.dom.sidebarColorPicker.value = this.theme.sidebarColor || '#F4F8F5';
            this.dom.textColorPicker.value = this.theme.textColor || '#1E293B';
            this.dom.footerTextInput.value = this.theme.footerText || '';
            this.openModal(this.dom.themeSettingsModal);
        });

        // Theme Preset Buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetKey = btn.getAttribute('data-preset');
                if (presetKey === 'default') {
                    this.dom.primaryColorPicker.value = '#2E7D32';
                    this.dom.sidebarColorPicker.value = '#F4F8F5';
                    this.dom.textColorPicker.value = '#1E293B';
                } else if (presetKey === 'ocean') {
                    this.dom.primaryColorPicker.value = '#0288D1';
                    this.dom.sidebarColorPicker.value = '#E0F7FA';
                    this.dom.textColorPicker.value = '#0F172A';
                } else if (presetKey === 'purple') {
                    this.dom.primaryColorPicker.value = '#6A1B9A';
                    this.dom.sidebarColorPicker.value = '#F3E5F5';
                    this.dom.textColorPicker.value = '#1E1B4B';
                }
            });
        });

        this.dom.themeSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.theme.primaryColor = this.dom.primaryColorPicker.value;
            this.theme.sidebarColor = this.dom.sidebarColorPicker.value;
            this.theme.textColor = this.dom.textColorPicker.value;
            this.theme.footerText = this.dom.footerTextInput.value;

            this.applyTheme();
            this.saveThemeState();
            this.closeModal(this.dom.themeSettingsModal);
            this.showToast('success', 'ปรับแต่งโทนสีและข้อความเรียบร้อย');
        });

        this.dom.resetThemeBtn.addEventListener('click', () => {
            this.theme = { ...DEFAULT_THEME, mode: this.theme.mode };
            this.applyTheme();
            this.saveThemeState();
            this.closeModal(this.dom.themeSettingsModal);
            this.showToast('success', 'คืนค่าโทนสีเริ่มต้นแล้ว');
        });

        // Embedded Viewer Actions
        this.dom.reloadFrameBtn.addEventListener('click', () => {
            if (this.dom.systemIframe.src) {
                this.dom.iframeLoader.classList.remove('hidden');
                this.dom.systemIframe.src = this.dom.systemIframe.src;
            }
        });

        this.dom.fullscreenFrameBtn.addEventListener('click', () => {
            const card = document.querySelector('.system-viewer-card');
            if (!document.fullscreenElement) {
                card.requestFullscreen().catch(err => alert(`Fullscreen Error: ${err.message}`));
            } else {
                document.exitFullscreen();
            }
        });

        this.dom.systemIframe.addEventListener('load', () => {
            this.dom.iframeLoader.classList.add('hidden');
        });

        // Close Modal Event Listeners
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-close-modal');
                const targetModal = document.getElementById(targetId);
                if (targetModal) this.closeModal(targetModal);
            });
        });

        // Modal Backdrop Click Outside
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) this.closeModal(backdrop);
            });
        });
    }

    // ----------------------------------------------------------------------
    // 4. AUTHENTICATION & ADMIN CONTROLS
    // ----------------------------------------------------------------------
    handleLogin() {
        const username = this.dom.loginUsername.value.trim();
        const password = this.dom.loginPassword.value.trim();

        if (username === 'admin' && password === 'admin752') {
            this.isAdmin = true;
            this.saveAuthState();
            this.closeModal(this.dom.loginModal);
            this.dom.loginForm.reset();
            this.updateAuthUI();
            this.renderNewsFeed();
            this.showToast('success', 'เข้าสู่ระบบผู้ดูแลระบบสำเร็จ (Admin)');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (User: admin / Pass: admin752)',
                confirmButtonColor: this.theme.primaryColor
            });
        }
    }

    handleLogout() {
        Swal.fire({
            title: 'ยืนยันการออกจากระบบ?',
            text: 'คุณต้องการออกจากระบบสิทธิ์ผู้ดูแลระบบใช่หรือไม่',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#64748B'
        }).then((result) => {
            if (result.isConfirmed) {
                this.isAdmin = false;
                this.saveAuthState();
                this.updateAuthUI();
                this.renderNewsFeed();
                this.showToast('info', 'ออกจากระบบเรียบร้อย');
            }
        });
    }

    updateAuthUI() {
        if (this.isAdmin) {
            this.dom.authText.textContent = 'ออกจากระบบ';
            this.dom.authIcon.className = 'fa-solid fa-right-from-bracket';
            this.dom.authBtn.className = 'btn-action btn-logout';
            this.dom.adminBadge.classList.remove('hidden');

            document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
        } else {
            this.dom.authText.textContent = 'เข้าสู่ระบบ';
            this.dom.authIcon.className = 'fa-solid fa-right-to-bracket';
            this.dom.authBtn.className = 'btn-action btn-login';
            this.dom.adminBadge.classList.add('hidden');

            document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
        }
    }

    // ----------------------------------------------------------------------
    // 5. THEME & COLOR ENGINE
    // ----------------------------------------------------------------------
    applyTheme() {
        // Set Light/Dark Theme Data Attribute
        document.documentElement.setAttribute('data-theme', this.theme.mode);
        this.dom.themeIcon.className = this.theme.mode === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

        // Apply Custom Colors via CSS Variables
        const root = document.documentElement;
        if (this.theme.primaryColor) {
            root.style.setProperty('--primary-color', this.theme.primaryColor);
            root.style.setProperty('--primary-hover', this.adjustColorBrightness(this.theme.primaryColor, -20));
            root.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${this.theme.primaryColor} 0%, ${this.adjustColorBrightness(this.theme.primaryColor, 30)} 100%)`);
        }
        if (this.theme.sidebarColor && this.theme.mode !== 'dark') {
            root.style.setProperty('--sidebar-bg', this.theme.sidebarColor);
        }
        if (this.theme.textColor && this.theme.mode !== 'dark') {
            root.style.setProperty('--text-main', this.theme.textColor);
        }

        // Apply Custom Footer
        if (this.dom.footerDevText) {
            this.dom.footerDevText.textContent = this.theme.footerText || DEFAULT_THEME.footerText;
        }

        // Apply Custom Logo if uploaded
        if (this.logo) {
            this.dom.appLogo.src = this.logo;
        }
    }

    adjustColorBrightness(hex, percent) {
        let num = parseInt(hex.replace('#', ''), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // ----------------------------------------------------------------------
    // 6. NAVIGATION & SUB-SYSTEM VIEWER
    // ----------------------------------------------------------------------
    switchToHomeTab() {
        this.activeTab = 'home';
        this.activeSystem = null;

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector('[data-tab="home"]').classList.add('active');

        this.dom.viewHome.classList.remove('hidden-view');
        this.dom.viewSystem.classList.add('hidden-view');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    switchToSystemTab(system) {
        this.activeTab = system.id;
        this.activeSystem = system;

        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`[data-tab="${system.id}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Setup Embedded Viewer Frame
        this.dom.activeSystemTitle.textContent = system.title;
        this.dom.activeSystemCategory.textContent = system.category || 'ระบบสารสนเทศ';
        this.dom.activeSystemIcon.className = `fa-solid ${system.icon || 'fa-globe'} toolbar-icon`;
        this.dom.openExternalBtn.href = system.url;
        this.dom.fallbackExternalLink.href = system.url;

        this.dom.iframeLoader.classList.remove('hidden');
        this.dom.systemIframe.src = system.url;

        this.dom.viewHome.classList.add('hidden-view');
        this.dom.viewSystem.classList.remove('hidden-view');

        // Close Mobile Menu if open
        this.dom.sidebarLeft.classList.remove('mobile-open');
        this.dom.sidebarOverlay.classList.remove('active');
    }

    renderSubSystemsNav() {
        this.dom.dynamicNavList.innerHTML = '';

        if (this.systems.length === 0) {
            this.dom.dynamicNavList.innerHTML = `<li class="nav-item"><span class="nav-link disabled" style="opacity:0.6; font-size:0.85rem;">ยังไม่มีระบบย่อย</span></li>`;
            return;
        }

        this.systems.forEach(sys => {
            const li = document.createElement('li');
            li.className = 'nav-item';

            const a = document.createElement('a');
            a.href = `#${sys.id}`;
            a.className = `nav-link ${this.activeTab === sys.id ? 'active' : ''}`;
            a.setAttribute('data-tab', sys.id);

            a.innerHTML = `
                <i class="fa-solid ${sys.icon || 'fa-globe'} nav-icon"></i>
                <span class="nav-text">${this.escapeHTML(sys.title)}</span>
            `;

            a.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToSystemTab(sys);
            });

            li.appendChild(a);
            this.dom.dynamicNavList.appendChild(li);
        });
    }

    renderSystemsTable() {
        this.dom.systemsTableBody.innerHTML = '';

        if (this.systems.length === 0) {
            this.dom.systemsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">ไม่พบข้อมูลระบบย่อย กรุณาเพิ่มระบบใหม่ด้านบน</td></tr>`;
            return;
        }

        this.systems.forEach((sys, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600; text-align:center;">#${index + 1}</td>
                <td><i class="fa-solid ${sys.icon || 'fa-globe'}" style="margin-right:0.4rem; color:var(--primary-color);"></i> <strong>${this.escapeHTML(sys.title)}</strong></td>
                <td style="font-size:0.85rem; color:var(--text-muted); word-break:break-all;">${this.escapeHTML(sys.url)}</td>
                <td>
                    <div class="reorder-btns">
                        <button class="btn-move" title="ขยับขึ้น" onclick="window.app.reorderSystem(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3;"' : ''}>
                            <i class="fa-solid fa-arrow-up"></i>
                        </button>
                        <button class="btn-move" title="ขยับลง" onclick="window.app.reorderSystem(${index}, 1)" ${index === this.systems.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>
                            <i class="fa-solid fa-arrow-down"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <div class="news-admin-actions">
                        <button class="btn-icon-sm" title="แก้ไข" onclick="window.app.editSubSystem('${sys.id}')">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-icon-sm btn-icon-delete" title="ลบ" onclick="window.app.deleteSubSystem('${sys.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            this.dom.systemsTableBody.appendChild(tr);
        });
    }

    reorderSystem(index, direction) {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= this.systems.length) return;

        // Swap items
        const temp = this.systems[index];
        this.systems[index] = this.systems[targetIndex];
        this.systems[targetIndex] = temp;

        this.saveSystemsState();
        this.renderSystemsTable();
        this.renderSubSystemsNav();
        this.showToast('success', 'สลับลำดับระบบย่อยเรียบร้อย');
    }

    handleSaveSubSystem() {
        const sysId = this.dom.systemFormId.value;
        const title = this.dom.sysTitle.value.trim();
        const url = this.dom.sysUrl.value.trim();
        const icon = this.dom.sysIcon.value;

        if (!title || !url) return;

        if (sysId) {
            // Edit Existing
            const item = this.systems.find(s => s.id === sysId);
            if (item) {
                item.title = title;
                item.url = url;
                item.icon = icon;
            }
            this.showToast('success', 'แก้ไขข้อมูลระบบเรียบร้อย');
        } else {
            // Add New
            const newSys = {
                id: 'sys_' + Date.now(),
                title,
                url,
                icon,
                category: 'ระบบสารสนเทศ',
                orderIndex: this.systems.length + 1
            };
            this.systems.push(newSys);
            this.showToast('success', 'เพิ่มระบบย่อยใหม่เรียบร้อย');
        }

        this.saveSystemsState();
        this.resetSubSystemForm();
        this.renderSystemsTable();
        this.renderSubSystemsNav();
    }

    editSubSystem(id) {
        const sys = this.systems.find(s => s.id === id);
        if (!sys) return;

        this.dom.systemFormId.value = sys.id;
        this.dom.sysTitle.value = sys.title;
        this.dom.sysUrl.value = sys.url;
        this.dom.sysIcon.value = sys.icon || 'fa-globe';

        document.getElementById('systemFormModeTitle').textContent = 'แก้ไขข้อมูลแท็บระบบ';
        this.dom.saveSysBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึกการแก้ไข';
        this.dom.cancelEditSysBtn.classList.remove('hidden');
    }

    deleteSubSystem(id) {
        const sys = this.systems.find(s => s.id === id);
        if (!sys) return;

        Swal.fire({
            title: `ยืนยันลบระบบ "${sys.title}"?`,
            text: 'คุณแน่ใจหรือไม่ว่าต้องการลบแท็บระบบนี้ออกจากเมนูทางซ้าย',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบรายการ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#EF4444'
        }).then((res) => {
            if (res.isConfirmed) {
                this.systems = this.systems.filter(s => s.id !== id);
                this.saveSystemsState();
                this.renderSystemsTable();
                this.renderSubSystemsNav();
                this.showToast('success', 'ลบรายการระบบย่อยเรียบร้อย');
            }
        });
    }

    resetSubSystemForm() {
        this.dom.systemForm.reset();
        this.dom.systemFormId.value = '';
        document.getElementById('systemFormModeTitle').textContent = 'เพิ่มแท็บระบบใหม่';
        this.dom.saveSysBtn.innerHTML = '<i class="fa-solid fa-plus"></i> บันทึกรายการระบบ';
        this.dom.cancelEditSysBtn.classList.add('hidden');
    }

    // ----------------------------------------------------------------------
    // 7. NEWS & ANNOUNCEMENTS ENGINE
    // ----------------------------------------------------------------------
    renderNewsFeed() {
        this.dom.newsContainer.innerHTML = '';

        if (this.news.length === 0) {
            this.dom.newsContainer.innerHTML = `
                <div class="news-card" style="text-align:center; padding:3rem 1.5rem; color:var(--text-muted);">
                    <i class="fa-solid fa-newspaper" style="font-size:3rem; margin-bottom:1rem; opacity:0.3;"></i>
                    <p>ยังไม่มีข่าวประชาสัมพันธ์ในขณะนี้</p>
                </div>
            `;
            return;
        }

        this.news.forEach(item => {
            const card = document.createElement('article');
            card.className = 'news-card';

            // Category Badge Style
            let badgeClass = 'badge-category';
            if (item.category === 'ประกาศสำคัญ') badgeClass = 'badge-admin';

            // Attached files pills HTML
            let filesHTML = '';
            const hasFiles = (item.file1Name && item.file1Url) || (item.file2Name && item.file2Url) || (item.file3Name && item.file3Url);
            
            if (hasFiles) {
                filesHTML = `
                    <div class="news-files-container">
                        <div class="news-files-title"><i class="fa-solid fa-paperclip"></i> เอกสารดาวน์โหลดแนบ:</div>
                        <div class="files-list">
                            ${item.file1Name && item.file1Url ? `<a href="${this.escapeHTML(item.file1Url)}" target="_blank" class="file-pill"><i class="fa-solid fa-file-pdf"></i> ${this.escapeHTML(item.file1Name)}</a>` : ''}
                            ${item.file2Name && item.file2Url ? `<a href="${this.escapeHTML(item.file2Url)}" target="_blank" class="file-pill"><i class="fa-solid fa-file-word"></i> ${this.escapeHTML(item.file2Name)}</a>` : ''}
                            ${item.file3Name && item.file3Url ? `<a href="${this.escapeHTML(item.file3Url)}" target="_blank" class="file-pill"><i class="fa-solid fa-file-excel"></i> ${this.escapeHTML(item.file3Name)}</a>` : ''}
                        </div>
                    </div>
                `;
            }

            // Images Gallery Grid HTML
            let galleryHTML = '';
            if (item.images && item.images.length > 0) {
                const imgBoxes = item.images.map((imgUrl, idx) => `
                    <div class="gallery-thumb-box" onclick="window.app.openLightbox('${item.id}', ${idx})">
                        <img src="${this.escapeHTML(imgUrl)}" alt="ภาพประกอบ ${idx + 1}" class="gallery-thumb-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80';">
                    </div>
                `).join('');
                galleryHTML = `<div class="news-gallery-grid">${imgBoxes}</div>`;
            }

            // Admin Action Buttons
            const adminActionsHTML = this.isAdmin ? `
                <div class="news-admin-actions">
                    <button class="btn-icon-sm" title="แก้ไขข่าว" onclick="window.app.openNewsModal('${item.id}')">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-icon-sm btn-icon-delete" title="ลบข่าว" onclick="window.app.deleteNews('${item.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            ` : '';

            card.innerHTML = `
                <div class="news-header">
                    <div class="news-meta">
                        <span class="badge ${badgeClass}">${this.escapeHTML(item.category || 'ข่าวประชาสัมพันธ์')}</span>
                        <span class="news-date"><i class="fa-regular fa-clock"></i> ${this.escapeHTML(item.date)}</span>
                    </div>
                    ${adminActionsHTML}
                </div>
                <h4 class="news-card-title">${this.escapeHTML(item.title)}</h4>
                <div class="news-card-content">${this.escapeHTML(item.content)}</div>
                ${filesHTML}
                ${galleryHTML}
            `;

            this.dom.newsContainer.appendChild(card);
        });
    }

    openNewsModal(newsId = null) {
        if (newsId) {
            const item = this.news.find(n => n.id === newsId);
            if (item) {
                this.dom.newsModalTitle.textContent = 'แก้ไขข่าวประชาสัมพันธ์';
                this.dom.newsId.value = item.id;
                this.dom.newsTitle.value = item.title;
                this.dom.newsCategory.value = item.category || 'ข่าวทั่วไป';
                this.dom.newsContent.value = item.content;
                this.dom.file1Name.value = item.file1Name || '';
                this.dom.file1Url.value = item.file1Url || '';
                this.dom.file2Name.value = item.file2Name || '';
                this.dom.file2Url.value = item.file2Url || '';
                this.dom.file3Name.value = item.file3Name || '';
                this.dom.file3Url.value = item.file3Url || '';
                this.dom.newsImages.value = item.images ? item.images.join(', ') : '';
            }
        } else {
            this.dom.newsModalTitle.textContent = 'เพิ่มข่าวประชาสัมพันธ์';
            this.dom.newsForm.reset();
            this.dom.newsId.value = '';
            this.dom.imagePreviewGrid.innerHTML = '';
        }
        this.openModal(this.dom.newsModal);
    }

    handleImageFilesPreview(files) {
        this.dom.imagePreviewGrid.innerHTML = '';
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'mini-img-preview';
                this.dom.imagePreviewGrid.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    async handleSaveNews() {
        const id = this.dom.newsId.value;
        const title = this.dom.newsTitle.value.trim();
        const category = this.dom.newsCategory.value;
        const content = this.dom.newsContent.value.trim();
        const file1Name = this.dom.file1Name.value.trim();
        const file1Url = this.dom.file1Url.value.trim();
        const file2Name = this.dom.file2Name.value.trim();
        const file2Url = this.dom.file2Url.value.trim();
        const file3Name = this.dom.file3Name.value.trim();
        const file3Url = this.dom.file3Url.value.trim();

        // Process images from textarea
        let imagesList = [];
        const imagesRaw = this.dom.newsImages.value.trim();
        if (imagesRaw) {
            imagesList = imagesRaw.split(',').map(url => url.trim()).filter(url => url.length > 0);
        }

        // Process uploaded image files to Base64
        const files = this.dom.newsImageFiles.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const base64 = await this.fileToBase64(files[i]);
                imagesList.push(base64);
            }
        }

        const nowStr = new Date().toLocaleString('th-TH', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit'
        });

        if (id) {
            // Edit existing
            const item = this.news.find(n => n.id === id);
            if (item) {
                item.title = title;
                item.category = category;
                item.content = content;
                item.file1Name = file1Name;
                item.file1Url = file1Url;
                item.file2Name = file2Name;
                item.file2Url = file2Url;
                item.file3Name = file3Name;
                item.file3Url = file3Url;
                if (imagesList.length > 0) item.images = imagesList;
            }
            this.showToast('success', 'แก้ไขข่าวประชาสัมพันธ์สำเร็จ');
        } else {
            // Add new (Newest at top!)
            const newNews = {
                id: 'news_' + Date.now(),
                title,
                category,
                content,
                date: nowStr,
                file1Name, file1Url,
                file2Name, file2Url,
                file3Name, file3Url,
                images: imagesList
            };
            this.news.unshift(newNews);
            this.showToast('success', 'ประกาศข่าวใหม่สำเร็จ');
        }

        this.saveNewsState();
        this.renderNewsFeed();
        this.closeModal(this.dom.newsModal);
    }

    deleteNews(id) {
        Swal.fire({
            title: 'ยืนยันลบข่าวประชาสัมพันธ์นี้?',
            text: 'การดำเนินการนี้ไม่สามารถย้อนกลับได้',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบข่าวสาร',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#EF4444'
        }).then((res) => {
            if (res.isConfirmed) {
                this.news = this.news.filter(n => n.id !== id);
                this.saveNewsState();
                this.renderNewsFeed();
                this.showToast('success', 'ลบข่าวประชาสัมพันธ์เรียบร้อย');
            }
        });
    }

    openLightbox(newsId, imgIndex) {
        const item = this.news.find(n => n.id === newsId);
        if (!item || !item.images || item.images.length === 0) return;

        this.dom.lightboxMainImg.src = item.images[imgIndex];
        this.dom.lightboxThumbs.innerHTML = '';

        item.images.forEach((url, i) => {
            const thumb = document.createElement('img');
            thumb.src = url;
            thumb.className = `mini-img-preview ${i === imgIndex ? 'active' : ''}`;
            thumb.style.cursor = 'pointer';
            thumb.addEventListener('click', () => {
                this.dom.lightboxMainImg.src = url;
                document.querySelectorAll('#lightboxThumbs img').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
            this.dom.lightboxThumbs.appendChild(thumb);
        });

        this.openModal(this.dom.imageLightboxModal);
    }

    // ----------------------------------------------------------------------
    // 8. LOGO UPLOADER ENGINE
    // ----------------------------------------------------------------------
    handleSaveLogo() {
        const file = this.dom.logoFileInput.files[0];
        const urlInput = this.dom.logoUrlInput.value.trim();

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.logo = e.target.result;
                this.saveLogoState();
                this.applyTheme();
                this.closeModal(this.dom.logoModal);
                this.showToast('success', 'เปลี่ยนโลโก้โรงเรียนสำเร็จ');
            };
            reader.readAsDataURL(file);
        } else if (urlInput) {
            this.logo = urlInput;
            this.saveLogoState();
            this.applyTheme();
            this.closeModal(this.dom.logoModal);
            this.showToast('success', 'เปลี่ยนโลโก้โรงเรียนสำเร็จ');
        }
    }

    // ----------------------------------------------------------------------
    // 9. RENDER ALL & UI UTILITIES
    // ----------------------------------------------------------------------
    renderAll() {
        this.updateAuthUI();
        this.renderSubSystemsNav();
        this.renderNewsFeed();
    }

    openModal(modalElem) {
        if (modalElem) modalElem.classList.remove('hidden');
    }

    closeModal(modalElem) {
        if (modalElem) modalElem.classList.add('hidden');
    }

    showToast(icon, title) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
        });
        Toast.fire({ icon, title });
    }

    showSpinner(text = 'กำลังโหลดข้อมูล...') {
        if (this.dom.loadingText) this.dom.loadingText.textContent = text;
        if (this.dom.loadingOverlay) this.dom.loadingOverlay.classList.remove('hidden');
    }

    hideSpinner() {
        if (this.dom.loadingOverlay) this.dom.loadingOverlay.classList.add('hidden');
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EvaluationSystemApp();
});
