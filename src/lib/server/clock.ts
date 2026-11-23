import 'server-only';

export const TIME_ZONE = 'America/Guayaquil';

/** Production always trusts the server clock. No browser data enters this decision. */
export function getServerNow(): number {
  const override = process.env.NODE_ENV === 'development' ? process.env.DEV_NOW : undefined;
  if (override) {
    // Require an explicit offset. An ambiguous date must never depend on host timezone.
    if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(override)) {
      throw new Error('DEV_NOW debe incluir una zona horaria, por ejemplo 2026-11-27T12:00:00-05:00.');
    }
    const simulated = Date.parse(override);
    if (!Number.isFinite(simulated)) throw new Error('DEV_NOW contiene una fecha inválida.');
    // Advance from the simulated instant so the open-page midnight flow can be tested.
    return simulated + (Date.now() - simulationStartedAt);
  }
  return Date.now();
}

const simulationStartedAt = Date.now();

export function isUnlocked(unlockAt: string, now = getServerNow()): boolean {
  const unlockTime = Date.parse(unlockAt);
  return Number.isFinite(unlockTime) && now >= unlockTime;
}
