# Tamagotchi Blob 🫧

A 3D virtual pet app built with React, Spline, and Framer Motion.

## Features

- **3D Pet**: Interactive Spline 3D blob you can pet by clicking
- **Stats System**: Track Vibe (happiness), Fuel (hunger), and Battery (energy)
- **Time-based Backgrounds**: Gradient changes based on real time (sunrise → sunset → night)
- **Sleep Mode**: Put your blob to sleep to restore energy
- **Persistence**: Stats save to localStorage - your blob remembers you!
- **Evolution**: Keep stats high for 30 seconds to level up (demo speed)
- **Glassmorphism UI**: Beautiful semi-transparent cards with blur effects

## Tech Stack

- **React** + Vite
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **@splinetool/react-spline** - 3D pet rendering
- **Radix UI** - Accessible components
- **Lucide React** - Icons

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## How to Play

1. **Feed** 🍽️ - Restores 20% Fuel
2. **Pet** 💖 - Click the blob or button for +15% Vibe
3. **Sleep** 🌙 - Toggle sleep mode to restore Battery

Keep all stats above 80% to level up your blob!

## License

MIT
