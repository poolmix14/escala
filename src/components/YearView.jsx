import { motion } from 'framer-motion';
import MiniMonth from './MiniMonth';

export default function YearView({ year, isWorkDay, holidaySet, onMonthClick, today }) {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-3 pb-24"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {months.map((month) => (
          <MiniMonth
            key={month}
            year={year}
            month={month}
            isWorkDay={isWorkDay}
            holidaySet={holidaySet}
            onMonthClick={onMonthClick}
            today={today}
          />
        ))}
      </div>
    </motion.div>
  );
}
