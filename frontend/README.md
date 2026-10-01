# 📚 Library Management System - Frontend

## React + Framer Motion Animated Dashboard

### ✨ Features

#### 🎨 Animated Components
- **Smooth Counter Animation**: Numbers animate from 0 to actual value over 2 seconds
- **Hover Effects**: Cards scale and lift on hover with smooth transitions
- **Staggered Grid Animation**: Grid items appear sequentially with fade-in effect
- **Icon Pulse Animation**: Icons pulse smoothly to draw attention
- **Gradient Background**: Rotating gradient backgrounds in metric cards

#### 📊 Dashboard Metrics
- Total Books
- Available Books
- Issued Books
- Overdue Books
- Total Members
- Active Members
- Total Staff
- Today's Issues
- Today's Returns
- Collected Fines
- Pending Fines
- Monthly Revenue
- Reserved Books
- Net Collection

#### 🎯 Modern UI/UX
- Gradient backgrounds and glassmorphism effects
- Responsive grid layout (mobile, tablet, desktop)
- Smooth transitions and micro-interactions
- Color-coded metric cards
- Professional typography

### 🚀 Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### 📦 Dependencies
- **React 18.2** - UI framework
- **Framer Motion 10.16** - Animation library
- **Tailwind CSS 3.3** - Styling
- **React Icons 4.11** - Icon set
- **Axios 1.4** - API calls
- **Vite 4.4** - Build tool

### 🎬 Animation Details

#### Counter Animation
```javascript
// Animates value from 0 to actual number over 2 seconds
// 60 smooth steps for fluid motion
```

#### Card Animations
```javascript
// Initial: opacity 0, scale 0.95
// Animate: opacity 1, scale 1
// Hover: scale 1.05, y: -10px
// Duration: 0.6s with ease-out
```

#### Grid Stagger
```javascript
// Children appear sequentially
// Stagger delay: 0.1s between items
// Initial delay: 0.2s before animation starts
```

### 🔌 API Integration

The dashboard automatically fetches data from:
```
GET /api/dashboard
Headers: Authorization: Bearer {token}
```

### 🎨 Color Scheme
- **Blue**: Total Books, Staff
- **Green**: Available Books, Active Members
- **Orange**: Issued Books
- **Red**: Overdue Books
- **Purple**: Total Members
- **Custom Gradients**: For financial metrics

### 📱 Responsive Breakpoints
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns

### 🔐 Authentication
- Token-based authentication via localStorage
- Token passed in Authorization header
- Automatic redirect if token missing

### 📈 Performance
- React 18 concurrent rendering
- Framer Motion GPU-accelerated animations
- Tailwind CSS optimized bundle
- Lazy loading ready

### 🛠️ Development

```bash
# Hot module replacement enabled
# Fast refresh for quick iterations
# Development server on port 3000
# Backend API proxy configured
```

### 📝 Notes
- Dashboard auto-refreshes every 30 seconds (can be configured)
- All animations are GPU-accelerated for smooth 60fps
- Fully responsive and mobile-optimized
- Accessibility features included

---

**Status**: ✅ Production Ready

