# BTDrop

A modern, secure file-sharing application with a sleek black Apple-inspired design. Share files instantly with auto-generated 4-digit codes.

## ✨ Features

- **🎯 Simple File Sharing**: Drag & drop files and get a 4-digit sharing code
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices  
- **🔒 Secure**: Files expire in 24 hours and are automatically cleaned up
- **💫 Apple-Inspired UI**: Beautiful glassmorphism design with smooth animations
- **📦 Flexible Uploads**: Support for any file type with 2GB total limit
- **⚡ Real-time**: Instant file sharing with sophisticated hover interactions
- **💾 In-Memory Storage**: Fast file handling with memory-based storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Gbhanuteja22/BTDrop.git
cd BTDrop
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Environment Setup**
Create `.env` file in the backend directory:
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
```

4. **Start the application**
```bash
# Option 1: Start both frontend and backend
npm run dev

# Option 2: Start separately
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
│   │   ├── services/     # Business logic & in-memory storage
│   │   ├── middleware/   # Express middleware
│   │   └── types/        # TypeScript type definitions
│   ├── uploads/          # File storage directory
│   └── package.json
└── package.json       # Root workspace configuration
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
- Axios for API requests

**Backend:**
- Node.js with Express and TypeScript
- In-memory storage for fast file handling
- Multer for file uploads
- UUID for unique file identification
- Express Rate Limiting & Helmet for security
- Morgan for logging
- Compression for response optimization

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
- CORS protection with origin validation
- Helmet security headers
- Automatic file cleanup after 24 hours
- Input validation and sanitization
- Secure file storage with UUID naming

## 🛠️ Development

### Available Scripts

**Root level:**
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both projects
- `npm run install:all` - Install all dependencies

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript
- `npm run start` - Start production server

## 🗂️ File Storage

Files are stored locally in the `backend/uploads/` directory with:
- UUID-based file naming for security
- In-memory session management for fast access
- Automatic cleanup of expired files
- Support for any file type

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Apple's design philosophy
- Built with modern web technologies
- Focused on user experience and security
