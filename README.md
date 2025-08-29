# BTDrop

A modern, secure file-sharing application with a sleek black Apple-inspired design. Share files instantly with auto-generated 4-digit codes.

## ✨ Features

- **🎯 Simple File Sharing**: Drag & drop files and get a 4-digit sharing code
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices  
- **🔒 Secure**: Files expire in 24 hours and are automatically cleaned up
- **💫 Apple-Inspired UI**: Beautiful glassmorphism design with smooth animations
- **📦 Flexible Uploads**: Support for any file type with 2GB total limit
- **⚡ Real-time**: Instant file sharing with sophisticated hover interactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/BTDrop.git
cd BTDrop
```

2. **Install dependencies**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. **Environment Setup**
Create `.env` file in the backend directory:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@localhost:5432/btdrop
```

4. **Start the application**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

5. **Visit** `http://localhost:5173`

## 🏗️ Project Structure

```
BTDrop/
├── frontend/          # React frontend with Vite
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities and API
│   │   └── index.css     # Tailwind CSS styles
│   └── package.json
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Express middleware
│   └── package.json
└── package.json       # Root package.json
```

## 🎨 Design Features

- **Glassmorphism Effects**: Subtle transparency and blur effects
- **Interactive Elements**: Sophisticated hover states with mutual exclusivity
- **Custom Cursor**: RGB glow cursor for enhanced interactivity  
- **Responsive Layout**: Adaptive 2-column (upload) and 3-column (download) layouts
- **Typography**: Apple-inspired font hierarchy with brightness animations

## 🔧 Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- TanStack Query for state management

**Backend:**
- Node.js with Express
- TypeScript
- PostgreSQL database
- Helmet for security
- Express Rate Limiting

## 📋 Usage

### Sending Files
1. Choose sharing type (One-to-One or One-to-Many)
2. Drag & drop files or click to browse  
3. Upload files (2GB total limit)
4. Share the generated 4-digit code

### Receiving Files
1. Enter the 4-digit code you received
2. Download files individually
3. Files are automatically deleted after download

## 🔒 Security Features

- Rate limiting on uploads and API endpoints
- CORS protection
- Helmet security headers
- Automatic file cleanup after 24 hours
- Input validation and sanitization
# BTDrop
