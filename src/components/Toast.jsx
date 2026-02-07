import { motion, AnimatePresence } from 'framer-motion'

export function Toast({ message, isVisible, type = 'default' }) {
  const colors = {
    vibe: 'from-pink-500 to-rose-500',
    fuel: 'from-green-500 to-emerald-500',
    battery: 'from-blue-500 to-indigo-500',
    default: 'from-white/20 to-white/10',
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className={`
            fixed bottom-8 left-1/2 -translate-x-1/2 z-50
            px-6 py-3 rounded-2xl
            bg-gradient-to-r ${colors[type]}
            text-white font-semibold text-lg
            shadow-2xl shadow-black/20
            backdrop-blur-xl
            border border-white/20
          `}
        >
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
