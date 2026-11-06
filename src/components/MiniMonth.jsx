import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { isHoliday } from '../lib/holidays';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function MiniMonth({ year, month, isWorkDay, holidaySet, onMonthClick, today }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const days = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [firstDay, daysInMonth]);

  return (
    <div className="px-1 cursor-pointer" onClick={() => onMonthClick(month)}>
      <motion.button whileTap={{ scale: 0.93 }} className="text-left mb-2 focus:outline-none">
        <h3 className={`text-xl font-bold tracking-tight ${isCurrentMonth ? 'text-primary' : 'text-foreground'}`}>
          {MONTH_NAMES[month]}
        </h3>
      </motion.button>

      <div className="grid grid-cols-7 gap-0">
        {WEEKDAYS.map((day, i) => (
          <div key={i} className="text-center text-[10px] text-muted-foreground/60 font-medium py-0.5">
            {day}
          </div>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} className="aspect-square" />;

          const date = new Date(year, month, day);
          const working = isWorkDay(date);
          const holiday = holidaySet ? isHoliday(date, holidaySet) : null;
          const isToday = isCurrentMonth && day === todayDate;

          let bgColor;
          let textColor;
          let borderColor = null;

          if (isToday && working) {
            bgColor = 'hsl(var(--primary))';
            textColor = 'text-primary-foreground font-bold';
          } else if (isToday && !working) {
            bgColor = 'rgba(34,197,94,0.9)';
            textColor = 'text-white font-bold';
          } else if (working) {
            bgColor = 'rgba(239,68,68,0.12)';
            textColor = 'text-primary font-semibold';
            borderColor = 'rgba(239,68,68,0.3)';
          } else {
            bgColor = 'rgba(34,197,94,0.12)';
            textColor = 'text-green-400 font-semibold';
            borderColor = 'rgba(34,197,94,0.3)';
          }

          return (
            <div
              key={day}
              className="aspect-square flex flex-col items-center justify-center rounded-xl relative text-[11px] font-medium transition-colors duration-150"
              style={{ backgroundColor: bgColor }}
            >
              <span className={textColor}>{day}</span>
              {holiday && <span className="w-1 h-1 rounded-full bg-blue-500 mt-0.5" />}
              {borderColor && (
                <span
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  style={{ border: `1px solid ${borderColor}` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
