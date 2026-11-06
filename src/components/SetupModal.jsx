import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const fmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function SetupModal({ referenceDate, onSave, onClose }) {
  const [dateValue, setDateValue] = useState(fmt(referenceDate));

  const handleSave = () => {
    if (!dateValue) return;
    const [y, m, d] = dateValue.split('-').map(Number);
    onSave(new Date(y, m - 1, d));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card rounded-3xl p-6 pb-8 border border-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Configurar Escala 12x36</h2>
          <button onClick={onClose} className="p-1 text-muted-foreground active:opacity-50" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Escolha um dia em que você <span className="text-primary font-semibold">trabalhou</span>. O app vai calcular
          os próximos turnos automaticamente (1 dia trabalho, 1 dia folga).
        </p>

        <label className="block text-sm font-medium text-foreground mb-2 text-center">
          Dia de trabalho de referência
        </label>
        <input
          type="date"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
          className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
          style={{ colorScheme: 'dark', maxWidth: '220px', display: 'block', margin: '0 auto' }}
        />

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-primary text-primary-foreground font-semibold text-base py-4 rounded-2xl active:opacity-80 transition-opacity"
        >
          Salvar Escala
        </button>
      </motion.div>
    </motion.div>
  );
}
