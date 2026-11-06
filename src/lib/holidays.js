function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getHolidaysForYear(year) {
  const easter = getEaster(year);
  const holidays = [];

  holidays.push({ date: addDays(easter, -48), name: 'Segunda de Carnaval', type: 'municipal' });
  holidays.push({ date: addDays(easter, -47), name: 'Terça de Carnaval', type: 'municipal' });
  holidays.push({ date: addDays(easter, -46), name: 'Quarta de Cinzas', type: 'municipal' });
  holidays.push({ date: addDays(easter, -2), name: 'Sexta-Feira Santa', type: 'nacional' });
  holidays.push({ date: easter, name: 'Páscoa', type: 'nacional' });
  holidays.push({ date: addDays(easter, 60), name: 'Corpus Christi', type: 'municipal' });

  const national = [
    { month: 0, day: 1, name: 'Confraternização Universal' },
    { month: 3, day: 21, name: 'Tiradentes' },
    { month: 4, day: 1, name: 'Dia do Trabalhador' },
    { month: 8, day: 7, name: 'Independência do Brasil' },
    { month: 9, day: 12, name: 'Nossa Sra. Aparecida' },
    { month: 10, day: 2, name: 'Finados' },
    { month: 10, day: 15, name: 'Proclamação da República' },
    { month: 11, day: 25, name: 'Natal' },
  ];

  const municipal = [
    { month: 0, day: 20, name: 'São Sebastião (Padroeiro do RJ)' },
    { month: 3, day: 23, name: 'Dia de São Jorge' },
    { month: 10, day: 20, name: 'Consciência Negra' },
  ];

  national.forEach(({ month, day, name }) => {
    holidays.push({ date: new Date(year, month, day), name, type: 'nacional' });
  });

  municipal.forEach(({ month, day, name }) => {
    holidays.push({ date: new Date(year, month, day), name, type: 'municipal' });
  });

  return holidays.map((h) => ({
    ...h,
    key: `${h.date.getFullYear()}-${h.date.getMonth()}-${h.date.getDate()}`,
  }));
}

export function buildHolidaySet(year) {
  const map = {};
  getHolidaysForYear(year).forEach((h) => {
    map[h.key] = { name: h.name, type: h.type };
  });
  return map;
}

export function isHoliday(date, holidaySet) {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  return holidaySet[key] || null;
}

export function getHolidaysForMonth(year, month, holidaySet) {
  return Object.entries(holidaySet)
    .map(([key, val]) => {
      const [y, m, d] = key.split('-').map(Number);
      return { year: y, month: m, day: d, ...val };
    })
    .filter((h) => h.year === year && h.month === month)
    .sort((a, b) => a.day - b.day);
}
