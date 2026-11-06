import { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buildHolidaySet } from '../lib/holidays';
import YearView from '../components/YearView';
import MonthView from '../components/MonthView';
import BottomBar from '../components/BottomBar';
import SetupModal from '../components/SetupModal';

const STORAGE_KEY = 'escala_ref_date';

function makeIsWorkDay(referenceDate) {
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);
  return function isWorkDay(date) {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - ref.getTime()) / 86400000);
    return ((diffDays % 2) + 2) % 2 === 0;
  };
}

function readSavedDate() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Date(saved) : null;
  } catch {
    return null;
  }
}

export default function Calendar() {
  const today = useMemo(() => new Date(), []);
  const saved = useMemo(readSavedDate, []);

  const [referenceDate, setReferenceDate] = useState(
    () => saved || new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [showSetup, setShowSetup] = useState(() => !saved);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  // Abre sempre no mês atual
  const [zoomedMonth, setZoomedMonth] = useState(today.getMonth());

  const isWorkDay = useMemo(() => makeIsWorkDay(referenceDate), [referenceDate]);
  const holidaySet = useMemo(() => buildHolidaySet(currentYear), [currentYear]);

  const handleSaveReference = useCallback((date) => {
    setReferenceDate(date);
    try {
      localStorage.setItem(STORAGE_KEY, date.toISOString());
    } catch {
      /* sem armazenamento: vale só nesta sessão */
    }
    setShowSetup(false);
  }, []);

  const handleBack = useCallback(() => setZoomedMonth(null), []);

  const handleTodayClick = useCallback(() => {
    setCurrentYear(today.getFullYear());
    setZoomedMonth(today.getMonth());
  }, [today]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && zoomedMonth !== null) handleBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [zoomedMonth, handleBack]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {zoomedMonth === null && (
        <div className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => window.location.reload()}
                className="p-2 active:opacity-50 transition-opacity text-xl"
                aria-label="Recarregar"
              >
                🔄
              </button>
              <button
                onClick={() => setCurrentYear((y) => y - 1)}
                className="p-2 active:opacity-50 transition-opacity"
                aria-label="Ano anterior"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{currentYear}</h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSetup(true)}
                className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold active:opacity-70 transition-opacity"
              >
                Início da Escala
              </button>
              <button
                onClick={() => setCurrentYear((y) => y + 1)}
                className="p-2 active:opacity-50 transition-opacity"
                aria-label="Próximo ano"
              >
                <ChevronRight className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 pb-2">
            <button
              onClick={handleTodayClick}
              className="text-xs font-semibold text-foreground/80 active:opacity-60 transition-opacity"
            >
              Hoje {String(today.getDate()).padStart(2, '0')}/{String(today.getMonth() + 1).padStart(2, '0')}/
              {today.getFullYear()}
            </button>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                Plantão
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                Folga
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                Feriado
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        {/* initial={false}: a primeira tela aparece na hora, sem esperar animação */}
        <AnimatePresence mode="wait" initial={false}>
          {zoomedMonth === null ? (
            <YearView
              key="year"
              year={currentYear}
              isWorkDay={isWorkDay}
              holidaySet={holidaySet}
              onMonthClick={setZoomedMonth}
              today={today}
            />
          ) : (
            <MonthView
              key={`month-${currentYear}-${zoomedMonth}`}
              year={currentYear}
              month={zoomedMonth}
              isWorkDay={isWorkDay}
              holidaySet={holidaySet}
              onBack={handleBack}
              today={today}
            />
          )}
        </AnimatePresence>
      </div>

      <BottomBar onTodayClick={handleTodayClick} />

      <AnimatePresence initial={false}>
        {showSetup && (
          <SetupModal referenceDate={referenceDate} onSave={handleSaveReference} onClose={() => setShowSetup(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
