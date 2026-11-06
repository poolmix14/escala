import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { isHoliday, getHolidaysForMonth } from '../lib/holidays';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function MonthView({ year, month, isWorkDay, holidaySet, onBack, today }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  const weeks = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    const result = [];
    for (let i = 0; i < cells.length; i += 7) result.push(cells.slice(i, i + 7));
    return result;
  }, [firstDay, daysInMonth]);

  const monthHolidays = useMemo(
    () => (holidaySet ? getHolidaysForMonth(year, month, holidaySet) : []),
    [year, month, holidaySet]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, y: 40 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex flex-col"
    >
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl pt-[max(env(safe-area-inset-top),16px)] pb-3 px-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1 text-primary active:opacity-60 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-base font-medium">{year}</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 active:opacity-50 transition-opacity text-xl"
            aria-label="Recarregar"
          >
            🔄
          </button>
        </div>
        <h2 className={`text-3xl font-bold mt-2 tracking-tight ${isCurrentMonth ? 'text-primary' : 'text-foreground'}`}>
          {MONTH_NAMES[month]}
        </h2>
      </div>

      <div className="flex-1 px-4 pb-24">
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((day, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground/70 font-medium py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => {
                if (day === null) return <div key={`empty-${di}`} className="aspect-square" />;

                const date = new Date(year, month, day);
                const working = isWorkDay(date);
                const holiday = holidaySet ? isHoliday(date, holidaySet) : null;
                const isToday = isCurrentMonth && day === todayDate;

                let bgColor;
                let textColor;
                let borderStyle = null;

                if (isToday && working) {
                  bgColor = 'hsl(var(--primary))';
                  textColor = 'text-primary-foreground font-bold';
                } else if (isToday && !working) {
                  bgColor = 'rgba(34,197,94,0.9)';
                  textColor = 'text-white font-bold';
                } else if (working) {
                  bgColor = 'rgba(239,68,68,0.1)';
                  textColor = 'text-primary font-semibold';
                  borderStyle = '1px solid rgba(239,68,68,0.25)';
                } else {
                  bgColor = 'rgba(34,197,94,0.1)';
                  textColor = 'text-green-400 font-semibold';
                  borderStyle = '1px solid rgba(34,197,94,0.25)';
                }

                return (
                  <div
                    key={day}
                    className="aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-colors duration-150"
                    style={{ backgroundColor: bgColor, border: borderStyle || undefined }}
                  >
                    <span className={`text-base ${textColor}`}>{day}</span>
                    {holiday && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />}
                  </div>
                );
              })}
              {Array.from({ length: 7 - week.length }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square" />
              ))}
            </div>
          ))}
        </div>

        {monthHolidays.length > 0 && (
          <div className="mt-6 mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              Feriados
            </h3>
            <div className="space-y-2">
              {monthHolidays.map((h, i) => {
                const weekDay = WEEKDAYS[new Date(year, month, h.day).getDay()];
                const isNacional = h.type === 'nacional';
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border">
                    <span className="text-blue-400 font-bold text-lg w-7 text-center shrink-0">{h.day}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{h.name}</p>
                      <p className="text-xs text-muted-foreground">{weekDay}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-lg">{isNacional ? '🇧🇷' : '🏳️'}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isNacional ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-500/10 text-blue-300'
                        }`}
                      >
                        {isNacional ? 'Nacional' : 'Municipal RJ'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
