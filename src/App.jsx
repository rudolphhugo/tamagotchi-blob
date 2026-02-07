import { useState, useEffect, useCallback } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Utensils, Battery, Moon, Sun, Sparkles } from 'lucide-react'

import { useInterval } from './hooks/useInterval'
import { usePetStats } from './hooks/usePetStats'
import { Progress } from './components/ui/progress'
import { Button } from './components/ui/button'
import { Toast } from './components/Toast'

// Get gradient based on real time
function getTimeGradient() {
  const hour = new Date().getHours()

  // Night (10pm - 5am): Deep blues and purples
  if (hour >= 22 || hour < 5) {
    return 'from-slate-900 via-indigo-950 to-purple-950'
  }
  // Early morning (5am - 8am): Sunrise pinks and oranges
  if (hour >= 5 && hour < 8) {
    return 'from-orange-400 via-pink-500 to-purple-600'
  }
  // Morning (8am - 12pm): Soft blues and pinks
  if (hour >= 8 && hour < 12) {
    return 'from-sky-400 via-blue-500 to-indigo-500'
  }
  // Afternoon (12pm - 5pm): Bright and warm
  if (hour >= 12 && hour < 17) {
    return 'from-cyan-400 via-blue-500 to-purple-500'
  }
  // Evening (5pm - 8pm): Sunset colors
  if (hour >= 17 && hour < 20) {
    return 'from-orange-500 via-pink-600 to-purple-700'
  }
  // Night transition (8pm - 10pm): Dusk
  return 'from-purple-600 via-indigo-700 to-slate-800'
}

function StatBar({ icon: Icon, label, value, colorClass }) {
  const getStatusColor = (val) => {
    if (val > 60) return 'text-green-400'
    if (val > 30) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-white/90">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </div>
        <span className={`font-bold ${getStatusColor(value)}`}>
          {Math.round(value)}%
        </span>
      </div>
      <Progress
        value={value}
        indicatorClassName={colorClass}
      />
    </div>
  )
}

function App() {
  const { stats, decayStats, feed, pet, toggleSleep, isFainted } = usePetStats()
  const [toast, setToast] = useState({ message: '', visible: false, type: 'default' })
  const [gradient, setGradient] = useState(getTimeGradient())

  // Update gradient every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGradient(getTimeGradient())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Decay stats every 5 seconds (demo speed)
  useInterval(decayStats, stats.isSleeping ? 3000 : 5000)

  const showToast = useCallback((message, type) => {
    setToast({ message, visible: true, type })
    setTimeout(() => {
      setToast(t => ({ ...t, visible: false }))
    }, 2000)
  }, [])

  const handleFeed = () => {
    const msg = feed()
    showToast(msg, 'fuel')
  }

  const handlePet = () => {
    const msg = pet()
    showToast(msg, 'vibe')
  }

  const handleSleep = () => {
    toggleSleep()
    showToast(stats.isSleeping ? 'Waking up!' : 'Sweet dreams...', 'battery')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} animated-gradient relative overflow-hidden`}>
      {/* Floating orbs for ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Sleep overlay */}
      <AnimatePresence>
        {stats.isSleeping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 sleep-overlay z-10 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              💤
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Level indicator */}
        <motion.div
          className="absolute top-6 right-6 glass rounded-2xl px-4 py-2 flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-white font-bold">Level {stats.level}</span>
        </motion.div>

        {/* Pet container */}
        <motion.div
          className={`relative w-full max-w-lg aspect-square ${isFainted ? 'fainted' : ''}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={handlePet}
          style={{ cursor: 'pointer' }}
        >
          <Spline
            scene="https://prod.spline.design/1SOeV7xTFTlWKP0R/scene.splinecode"
            className="w-full h-full"
          />

          {/* Click hint */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to pet!
          </motion.div>
        </motion.div>

        {/* Fainted warning */}
        <AnimatePresence>
          {isFainted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass-dark rounded-3xl p-6 text-center z-30"
            >
              <p className="text-2xl mb-2">😵</p>
              <p className="text-white font-bold text-lg">Your blob fainted!</p>
              <p className="text-white/70 text-sm">Feed or let it rest to recover</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats panel */}
        <motion.div
          className="glass rounded-3xl p-6 w-full max-w-md mt-4 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatBar
            icon={Heart}
            label="Vibe"
            value={stats.vibe}
            colorClass="progress-vibe"
          />
          <StatBar
            icon={Utensils}
            label="Fuel"
            value={stats.fuel}
            colorClass="progress-fuel"
          />
          <StatBar
            icon={Battery}
            label="Battery"
            value={stats.battery}
            colorClass="progress-battery"
          />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="secondary"
            size="lg"
            onClick={handleFeed}
            disabled={stats.isSleeping}
          >
            <Utensils className="w-5 h-5" />
            Feed
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handlePet}
            disabled={stats.isSleeping}
          >
            <Heart className="w-5 h-5" />
            Pet
          </Button>

          <Button
            variant="sleep"
            size="lg"
            onClick={handleSleep}
          >
            {stats.isSleeping ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {stats.isSleeping ? 'Wake' : 'Sleep'}
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-8 text-white/40 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Tamagotchi Blob v1.0 - Made with love
        </motion.p>
      </div>

      {/* Toast notifications */}
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        type={toast.type}
      />
    </div>
  )
}

export default App
