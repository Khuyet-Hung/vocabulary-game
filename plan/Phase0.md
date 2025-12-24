# Phase 0: Planning & Setup

⏱️ **Thời gian**: 30 phút  
🎯 **Mục tiêu**: Chuẩn bị môi trường phát triển và tài khoản cần thiết

---

## 📋 Checklist

- [ ] Node.js và npm đã cài đặt
- [ ] Git đã cài đặt
- [ ] Tài khoản GitHub
- [ ] Tài khoản Firebase
- [ ] Tài khoản Vercel (optional)
- [ ] Code editor (VS Code recommended)

---

## Step 0.1: Cài Đặt Môi Trường

### 1. Node.js & npm

**Kiểm tra version hiện tại:**
```bash
node --version  # Cần >= 18.17.0
npm --version
```

**Nếu chưa có, download tại:**
- https://nodejs.org/ (chọn LTS version)

**Sau khi cài đặt, verify:**
```bash
node --version
npm --version
```

### 2. Git

**Kiểm tra:**
```bash
git --version
```

**Nếu chưa có:**
- Windows: https://git-scm.com/download/win
- Mac: `brew install git` hoặc download từ git-scm.com
- Linux: `sudo apt-get install git`

**Config Git:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Code Editor

**VS Code (Recommended):**
- Download: https://code.visualstudio.com/

**Extensions nên cài:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- GitLens

---

## Step 0.2: Tạo Tài Khoản Cần Thiết

### 1. GitHub Account

**Đăng ký tại:** https://github.com/signup

**Tại sao cần:**
- Lưu trữ source code
- Version control
- Deploy tự động với Vercel

**Sau khi đăng ký:**
```bash
# Setup SSH key (optional nhưng recommended)
ssh-keygen -t ed25519 -C "your.email@example.com"
# Follow prompts, press Enter for defaults

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Vào GitHub Settings → SSH and GPG keys → Add SSH key
# Paste public key vào
```

### 2. Firebase Account

**Đăng ký tại:** https://console.firebase.google.com

**Tại sao cần:**
- Realtime Database cho multiplayer
- Authentication (sau này)
- Cloud Functions (optional)

**Sau khi đăng ký:**
1. Click "Add project"
2. Đặt tên project: `vocabulary-game` (hoặc tên bạn thích)
3. ❌ Tắt Google Analytics (không cần ở giai đoạn đầu)
4. Click "Create project"
5. Đợi Firebase setup (30-60 giây)

**Giữ tab Firebase console mở - sẽ dùng ở Phase 1**

### 3. Vercel Account (Optional - cho deploy)

**Đăng ký tại:** https://vercel.com/signup

**Tại sao cần:**
- Deploy app lên production miễn phí
- Tự động deploy khi push code lên GitHub
- SSL certificate tự động
- Global CDN

**Cách đăng ký:**
1. Click "Continue with GitHub"
2. Authorize Vercel để access GitHub repos
3. Done!

---

## Step 0.3: Chuẩn Bị Workspace

### 1. Tạo Folder Project

```bash
# Chọn nơi lưu project (ví dụ)
cd ~/Documents  # Mac/Linux
cd C:\Users\YourName\Documents  # Windows

# Tạo folder
mkdir projects
cd projects
```

### 2. Chuẩn Bị Terminal

**Mac/Linux:**
- Dùng Terminal mặc định
- Hoặc iTerm2 (Mac)

**Windows:**
- PowerShell (recommended)
- Hoặc Git Bash
- Hoặc Windows Terminal

---

## Step 0.4: Planning & Design

### 1. Định Nghĩa MVP (Minimum Viable Product)

**Core Features cho Phase đầu:**
- ✅ Tạo/Join phòng chơi
- ✅ Realtime multiplayer
- ✅ Game hub (danh sách games)
- ✅ Import từ vựng từ Google Sheets
- ✅ Mobile responsive

**Features để sau:**
- ❌ Authentication (login/signup)
- ❌ Leaderboard toàn cục
- ❌ Game logic (sẽ thêm từng game sau)
- ❌ Sound effects
- ❌ Achievements

### 2. Chuẩn Bị Google Sheet Mẫu

**Tạo sheet test:**
1. Vào Google Sheets: https://sheets.google.com
2. Tạo sheet mới: "Vocabulary Test Data"
3. Cấu trúc columns:

| word | meaning | example | category | difficulty |
|------|---------|---------|----------|------------|
| hello | xin chào | Hello, how are you? | greeting | easy |
| beautiful | đẹp | She is beautiful | adjective | easy |
| environment | môi trường | Protect the environment | noun | medium |

4. Share → "Anyone with the link can view"
5. Copy link - sẽ dùng ở Phase 2

---

## Step 0.5: Verify Setup

### Final Checklist

Chạy các lệnh sau để verify:

```bash
# Node.js
node --version
# Expected: v18.x.x hoặc cao hơn

# npm
npm --version
# Expected: 9.x.x hoặc cao hơn

# Git
git --version
# Expected: git version 2.x.x

# Kiểm tra có thể tạo folder
mkdir test-folder && cd test-folder && cd .. && rmdir test-folder
# Nếu không có lỗi = OK
```

### Tools Check

```bash
# VS Code (nếu đã cài)
code --version

# Hoặc mở VS Code và kiểm tra Extensions
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Node.js version cũ
```bash
# Uninstall version cũ
# Download version mới từ nodejs.org
# Hoặc dùng nvm (Node Version Manager)

# Mac/Linux
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Windows: Download nvm-windows
```

### Issue 2: npm command not found
```bash
# Thường do PATH không được set
# Restart terminal sau khi cài Node.js
# Hoặc restart máy tính
```

### Issue 3: Git không hoạt động trên Windows
```bash
# Cài Git Bash từ git-scm.com
# Hoặc dùng PowerShell với administrator
```

### Issue 4: Permission denied khi tạo folder
```bash
# Mac/Linux
sudo mkdir folder-name

# Hoặc chọn folder khác mà user có quyền
cd ~/Documents
```

---

## 📝 Notes

- **Thời gian setup**: Nếu đã có sẵn tools, chỉ mất 5-10 phút
- **First time**: Có thể mất 30-45 phút nếu cài đặt mọi thứ từ đầu
- **Internet**: Cần kết nối ổn định để download tools và tạo accounts

---

## ✅ Phase Completion

Sau khi hoàn thành Phase 0, bạn có:
- ✅ Node.js & npm ready
- ✅ Git ready
- ✅ GitHub account
- ✅ Firebase account
- ✅ Vercel account (optional)
- ✅ Workspace folder
- ✅ Google Sheet test data

---

## 🎯 Next Step

➡️ **[Phase 1: Project Setup & Foundation](./PHASE_1_Project_Setup_Foundation.md)**

Trong Phase 1, chúng ta sẽ:
- Tạo Next.js project
- Cấu hình Firebase
- Setup TypeScript types
- Tạo folder structure