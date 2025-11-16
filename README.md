# 🎮 Game Hub - Production-Ready Multi-Game Platform

A comprehensive collection of puzzle games built with React, TypeScript, and modern web technologies. This project transforms a simple Wordle clone into a full-featured gaming platform with multiple games, statistics tracking, and a polished user experience.

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4 + React Router
- **Backend**: Express API with comprehensive endpoints for all games
- **Deployment**: Production-ready monorepo deployed on Vercel
- **Games**: Wordle, Connections, Sudoku, and Numbers

## 🎯 Live Demo

**Play Now: [https://the-wordle-game.vercel.app/](https://the-wordle-game.vercel.app/)**

<p align="center">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white" alt="Swagger" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

## 🎮 Available Games

### 1. Wordle
Classic word-guessing game where you have 6 attempts to guess a 5-letter word. Each guess provides color-coded feedback.

**Features:**
- 5-letter word validation via API
- Color-coded feedback (correct, wrong position, not in word)
- On-screen keyboard with state tracking
- Physical keyboard support
- Win/loss tracking with localStorage

### 2. Connections
Find groups of four items that share something in common. Inspired by NYT's Connections game.

**Features:**
- 4 categories with varying difficulty levels
- Color-coded difficulty (Easy, Medium, Hard, Tricky)
- "One away" hints
- Mistake tracking (4 mistakes max)
- Shuffle and deselect functionality
- Dynamic puzzle generation

### 3. Sudoku
Fill a 9×9 grid with digits 1-9 such that each row, column, and 3×3 box contains all digits.

**Features:**
- Classic 9×9 Sudoku puzzles
- Visual highlighting for selected cells
- Keyboard and mouse input support
- Real-time validation
- Mistake tracking
- Pre-filled cells are locked

### 4. Numbers
Use mathematical operations (+, -, ×, ÷) to reach a target number from a set of given numbers.

**Features:**
- 6 numbers to work with
- All four basic operations
- Undo functionality
- Operation history tracking
- Division requires whole number results
- Multiple difficulty levels

## 📸 Screenshots

### Home Page - Game Selection
![Home Page](screenshots/home.png)
*Clean, animated gradient background with all available games*

### Wordle Game
![Wordle Game](screenshots/wordle.png)
*Classic Wordle gameplay with color-coded feedback*

### Connections Game
![Connections Game](screenshots/connections.png)
*Group words by common categories*

### Sudoku Game
![Sudoku Game](screenshots/sudoku.png)
*Traditional 9×9 Sudoku with visual cell highlighting*

### Numbers Game
![Numbers Game](screenshots/numbers.png)
*Mathematical puzzle game with operation tracking*

## 🚀 Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript 5.6+** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **React Router 6** - Client-side routing
- **Vite 6** - Lightning-fast build tool
- **Lucide React** - Beautiful icon library
- **Vercel Analytics** - Usage tracking

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type-safe backend code
- **Undici** - Fast HTTP client
- **CORS** - Cross-origin resource sharing
- **OpenAPI 3.0** - API documentation standard

### Production Features
- **Error Boundaries** - Graceful error handling
- **Loading States** - User feedback during API calls
- **Local Storage** - Statistics persistence
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags and semantic HTML
- **PWA Ready** - Service worker and manifest

## 📁 Project Structure

```
/
├── backend/
│   ├── index.ts              # Express API + all game endpoints
│   ├── favicon.ico           # API favicon
│   ├── package.json          # Backend dependencies
│   ├── tsconfig.json         # TypeScript config
│   └── vercel.json           # Serverless deployment config
│
├── src/
│   ├── components/           # Shared components
│   │   ├── ErrorBoundary.tsx # Error handling component
│   │   ├── Layout.tsx        # Page layout with navigation
│   │   ├── GameCard.tsx      # Game selection card
│   │   └── LoadingSpinner.tsx # Loading indicator
│   │
│   ├── pages/                # Game pages
│   │   ├── Home.tsx          # Home page with game selection
│   │   ├── WordleGame.tsx    # Wordle game logic
│   │   ├── ConnectionsGame.tsx # Connections game logic
│   │   ├── SudokuGame.tsx    # Sudoku game logic
│   │   └── NumbersGame.tsx   # Numbers game logic
│   │
│   ├── (Wordle components)   # Original Wordle components
│   │   ├── TileRow.tsx       # Row of 5 tiles
│   │   ├── Tile.tsx          # Individual tile
│   │   ├── Keyboard.tsx      # On-screen keyboard
│   │   ├── GameWon.tsx       # Victory screen
│   │   └── GameOver.tsx      # Game over screen
│   │
│   ├── App.tsx               # Router configuration
│   └── main.tsx              # Application entry point
│
├── public/                   # Static assets
│   ├── manifest.json         # PWA manifest
│   └── (favicon files)       # App icons
│
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
└── README.md                 # This file
```

## 🛠️ Development

### Prerequisites

- **Node.js** v16+
- **npm** or **yarn**
- (Optional) **Vercel CLI** for deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/hoangsonww/The-Wordle-Game.git
cd The-Wordle-Game

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Running Locally

#### Frontend Development Server

```bash
# From project root
npm run dev
```

Opens at [http://localhost:4260](http://localhost:4260)

#### Backend API Server

```bash
# From backend directory
cd backend
npm run build    # Compile TypeScript
npm start        # Start Express server
```

Runs at [http://localhost:3001](http://localhost:3001)

### Building for Production

```bash
# Frontend build
npm run build
# Output: dist/

# Backend build
cd backend
npm run build
# Output: backend/dist/
```

## 📖 API Documentation

### Live API Docs

- **Swagger UI**: [https://wordle-game-backend.vercel.app/api-docs](https://wordle-game-backend.vercel.app/api-docs)
- **OpenAPI Spec**: [https://wordle-game-backend.vercel.app/swagger.json](https://wordle-game-backend.vercel.app/swagger.json)

### Endpoints

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/api/random-word` | Get random 5-letter word | `{ "word": "apple" }` |
| GET | `/api/word-valid/:word` | Validate word | `{ "valid": true }` |
| GET | `/api/connections/puzzle` | Get Connections puzzle | `{ "groups": [...] }` |
| GET | `/api/sudoku/puzzle` | Get Sudoku puzzle | `{ "puzzle": [...], "solution": [...] }` |
| GET | `/api/numbers/puzzle` | Get Numbers puzzle | `{ "numbers": [...], "target": 347 }` |

### Example API Calls

```bash
# Get a random word for Wordle
curl https://wordle-game-backend.vercel.app/api/random-word

# Validate a word
curl https://wordle-game-backend.vercel.app/api/word-valid/hello

# Get a Connections puzzle
curl https://wordle-game-backend.vercel.app/api/connections/puzzle

# Get a Sudoku puzzle
curl https://wordle-game-backend.vercel.app/api/sudoku/puzzle

# Get a Numbers puzzle
curl https://wordle-game-backend.vercel.app/api/numbers/puzzle
```

## 🎨 Design Features

### Gradient Background Animation
All pages feature a beautiful animated gradient background that transitions smoothly between colors:
- Pink (#ff6ec4)
- Purple (#7873f5)
- Green (#4ade80)
- Yellow (#facc15)

### Consistent Styling
- Glass morphism effects (backdrop blur)
- Rounded corners and shadows
- Responsive design for all screen sizes
- Accessible color contrasts
- Smooth transitions and animations

### Color Coding
- **Lime Green** - Correct (Wordle) / Easy (Connections)
- **Yellow** - Wrong position (Wordle) / Medium (Connections)
- **Orange** - Hard difficulty (Connections)
- **Purple** - Tricky difficulty (Connections)
- **Blue** - Sudoku selections
- **Various** - Numbers game operations

## 📊 Statistics Tracking

Game statistics are stored in browser localStorage:
- Wordle wins
- Connections puzzles solved
- Sudoku puzzles completed
- Numbers puzzles solved

View your stats on the home page!

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

The monorepo structure automatically deploys:
- Frontend as static site
- Backend as serverless functions

### Manual Deployment

1. Build frontend: `npm run build`
2. Build backend: `cd backend && npm run build`
3. Deploy `dist/` to static hosting
4. Deploy `backend/` to Node.js hosting

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Type checking
npm run build

# Linting
npm run lint

# Format code
npm run format
```

## 🔧 Configuration

### Environment Variables

No environment variables required! The app works out of the box.

Optional:
- `PORT` - Backend server port (default: 3001)

### Customization

#### Add More Games
1. Create game component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add API endpoint in `backend/index.ts`
4. Add game card to `src/pages/Home.tsx`

#### Change Styling
- Modify gradient colors in Layout component
- Update Tailwind classes in components
- Adjust `styles.css` for global styles

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👨‍�💻 Author

**Son Nguyen**
- GitHub: [@hoangsonww](https://github.com/hoangsonww)
- Website: [https://sonnguyenhoang.com](https://sonnguyenhoang.com)

## 🙏 Acknowledgments

- Original Wordle game by Josh Wardle
- NYT Connections for game inspiration
- React and TypeScript communities
- Vercel for hosting platform

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📫 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/hoangsonww/The-Wordle-Game/issues)
- Contact via email: info@example.com

---

<p align="center">Made with ❤️ by Son Nguyen</p>
<p align="center">⭐ Star this repo if you find it helpful!</p>

## 🌟 Advanced Features

This platform now includes **40+ production-ready features** to provide a truly enterprise-grade experience:

### 🎨 User Experience
- **Dark Mode** - Toggle between light and dark themes with automatic saving
- **Animations** - Smooth Framer Motion animations throughout
- **Toast Notifications** - Elegant feedback with React Hot Toast
- **Responsive Design** - Perfect on desktop, tablet, and mobile

### 📊 Advanced Statistics
- **Comprehensive Tracking** - Detailed stats for every game
- **Visual Charts** - Beautiful charts with Recharts library
- **Achievements System** - 8 unlockable achievements with progress tracking
- **Performance Metrics** - Track your speed, streaks, and averages

### ⚙️ Customizable Settings
- **Appearance** - Dark mode, high contrast, font sizing
- **Gameplay** - Timer toggle, hints system, difficulty levels
- **Accessibility** - Reduced motion, keyboard navigation
- **Preferences** - Save all settings to localStorage

### 🚀 Performance Optimizations
- **Code Splitting** - Lazy loading for optimal performance
- **State Management** - Zustand for lightweight global state
- **Error Boundaries** - Graceful error handling
- **PWA Ready** - Installable as a progressive web app

### 🎮 Game Enhancements
- **Timer Component** - Optional speed challenge mode
- **Share Results** - Share your victories on social media
- **Help Modals** - Tutorial system for each game
- **Keyboard Support** - Full keyboard navigation

### 📱 Navigation
- **Settings Page** - Comprehensive settings management
- **Statistics Page** - Detailed analytics dashboard
- **Smooth Routing** - React Router with transitions
- **Header Links** - Quick access to settings and stats

## 📸 New Screenshots

### Settings Page
Customize your experience with comprehensive settings including dark mode, sound, timer, hints, and accessibility options.

### Statistics Dashboard
Track your performance across all games with beautiful charts, detailed metrics, and achievement progress.

### Enhanced Home Page
View quick stats overview, achievements progress, and animated game cards with individual game statistics.

## 🏆 Achievements

Unlock achievements as you play:
- 🎉 First Victory
- 🔥 Hot Streak (5 wins in a row)
- ⚡ Unstoppable (10 wins in a row)
- 🎮 Jack of All Trades (Win all game types)
- 🧠 Perfect Mind (Perfect Connections game)
- 💨 Speed Demon (Win under 60 seconds)
- 💯 Century Club (100 total games)
- 📝 Word Master (50 Wordle wins)

## 📊 Statistics Tracking

The platform now tracks comprehensive statistics:
- **Per-Game Metrics** - Wins, losses, averages, and speeds
- **Visual Charts** - Bar charts, pie charts, and distributions
- **Streaks** - Current and maximum win streaks
- **Personal Bests** - Fastest times and best performances

## ⚡ Performance

Optimized for speed and efficiency:
- **Bundle Size** - Code splitting reduces initial load (~78KB gzipped)
- **Lazy Loading** - Games loaded on demand (~2-7KB each)
- **Caching** - Smart caching strategies
- **Analytics** - Vercel Analytics for monitoring

## 🔧 Technical Stack (Updated)

### New Dependencies
- **Zustand** - State management
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization
- **Date-fns** - Date utilities

### Architecture
- **Component-based** - Modular and reusable
- **Type-safe** - Full TypeScript coverage
- **Performance-first** - Code splitting and optimization
- **Accessible** - WCAG compliant features

## 🎯 Future Enhancements

Planned features for future releases:
- User authentication
- Cloud save/sync
- Multiplayer modes
- More games
- Social features
- Mobile apps

