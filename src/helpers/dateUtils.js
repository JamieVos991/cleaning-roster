export function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }
  
  export function getWeekDateRange(year, week) {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (week - 1) * 7;
    const weekStart = new Date(firstDayOfYear.getTime() + daysOffset * 86400000);
  
    const day = weekStart.getDay();
    const diff = (day <= 0 ? -6 : 1) - day;
    weekStart.setDate(weekStart.getDate() + diff);
  
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
  
    const options = { day: "numeric", month: "long" };
    const startStr = weekStart.toLocaleDateString("nl-NL", options);
    const endStr = weekEnd.toLocaleDateString("nl-NL", options);
    return `${startStr} – ${endStr}`;
  }
  