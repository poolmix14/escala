import { motion } from 'framer-motion';

export default function BottomBar({ onTodayClick }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="bg-background/80 backdrop-blur-xl border-t border-border/50">
        <div className="max-w-lg mx-auto flex items-center justify-center px-6 pt-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          <button
            onClick={onTodayClick}
            className="text-sm font-semibold text-foreground/90 active:opacity-60 transition-opacity px-4 py-2 rounded-full bg-secondary/60 hover:bg-secondary"
          >
            Ir para hoje
          </button>
        </div>
      </div>
    </motion.div>
  );
}
