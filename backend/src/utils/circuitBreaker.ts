import { logger } from './logger';
import { incCounter } from './metrics';

export class CircuitOpenError extends Error {
  constructor() {
    super('Service circuit breaker is open — API temporarily unavailable');
    this.name = 'CircuitOpenError';
  }
}

type CircuitState = 'closed' | 'open' | 'half-open';

interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number;
  cooldownMs: number;
}

export interface CircuitBreaker {
  canAttempt(): boolean;
  recordSuccess(): void;
  recordFailure(): void;
  isOpen(): boolean;
  getState(): CircuitState;
}

export function createCircuitBreaker(config: CircuitBreakerConfig): CircuitBreaker {
  let state: CircuitState = 'closed';
  let consecutiveFailures = 0;
  let openedAt = 0;
  let halfOpenInFlight = false;

  function canAttempt(): boolean {
    if (state === 'closed') return true;

    if (state === 'open') {
      if (Date.now() - openedAt >= config.cooldownMs) {
        if (!halfOpenInFlight) {
          state = 'half-open';
          halfOpenInFlight = true;
          logger.info(`[circuit-breaker:${config.name}] Half-open — testing one request`);
          return true;
        }
      }
      return false;
    }

    return false;
  }

  function recordSuccess(): void {
    if (state !== 'closed') {
      logger.info(`[circuit-breaker:${config.name}] Closed — service resumed`);
      incCounter('circuit_breaker_resets_total', { name: config.name });
    }
    state = 'closed';
    consecutiveFailures = 0;
    halfOpenInFlight = false;
  }

  function recordFailure(): void {
    halfOpenInFlight = false;
    consecutiveFailures++;

    if (state === 'half-open') {
      state = 'open';
      openedAt = Date.now();
      logger.warn(
        { consecutiveFailures },
        `[circuit-breaker:${config.name}] Re-opened after half-open test failed`,
      );
      return;
    }

    if (consecutiveFailures >= config.failureThreshold && state === 'closed') {
      state = 'open';
      openedAt = Date.now();
      incCounter('circuit_breaker_trips_total', { name: config.name });
      logger.warn(
        { consecutiveFailures, cooldownMs: config.cooldownMs },
        `[circuit-breaker:${config.name}] Opened — requests will be skipped for ${config.cooldownMs / 1000}s`,
      );
    }
  }

  function isOpen(): boolean {
    if (state === 'open' && Date.now() - openedAt >= config.cooldownMs) {
      return false;
    }
    return state !== 'closed';
  }

  function getState(): CircuitState {
    return state;
  }

  return { canAttempt, recordSuccess, recordFailure, isOpen, getState };
}
