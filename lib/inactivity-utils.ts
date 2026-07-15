export function getInactivityDays(lastActivity: Date | string, now: Date = new Date()): number {
  const lastActiveDate = new Date(lastActivity);
  const diffInMs = now.getTime() - lastActiveDate.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

export function getAlertCycle(daysInactive: number): number {
  if (daysInactive >= 28 && daysInactive < 30) {
    return 4;
  }
  if (daysInactive >= 21 && daysInactive < 28) {
    return 3;
  }
  if (daysInactive >= 14 && daysInactive < 21) {
    return 2;
  }
  if (daysInactive >= 7 && daysInactive < 14) {
    return 1;
  }
  return 0;
}

export function shouldAutoCancel(daysInactive: number): boolean {
  return daysInactive >= 30;
}
