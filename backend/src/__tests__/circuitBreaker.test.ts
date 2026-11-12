import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import { createCircuitBreaker, CircuitOpenError } from '../utils/circuitBreaker';

test('starts closed and allows attempts', () => {
  const cb = createCircuitBreaker({ name: 'test', failureThreshold: 3, cooldownMs: 1000 });
  assert.equal(cb.getState(), 'closed');
  assert.equal(cb.canAttempt(), true);
  assert.equal(cb.isOpen(), false);
});

test('stays closed after fewer failures than threshold', () => {
  const cb = createCircuitBreaker({ name: 'test', failureThreshold: 3, cooldownMs: 1000 });
  cb.recordFailure();
  cb.recordFailure();
  assert.equal(cb.getState(), 'closed');
  assert.equal(cb.canAttempt(), true);
});

test('opens after reaching the failure threshold', () => {
  const cb = createCircuitBreaker({ name: 'test', failureThreshold: 3, cooldownMs: 60000 });
  cb.recordFailure();
  cb.recordFailure();
  cb.recordFailure();
  assert.equal(cb.getState(), 'open');
  assert.equal(cb.canAttempt(), false);
  assert.equal(cb.isOpen(), true);
});

test('resets failure count on success', () => {
  const cb = createCircuitBreaker({ name: 'test', failureThreshold: 3, cooldownMs: 1000 });
  cb.recordFailure();
  cb.recordFailure();
  cb.recordSuccess();
  assert.equal(cb.getState(), 'closed');
  // Two more failures should not open (count was reset)
  cb.recordFailure();
  cb.recordFailure();
  assert.equal(cb.getState(), 'closed');
});

test('transitions to half-open after cooldown and closes on success', async () => {
  const cb = createCircuitBreaker({ name: 'test', failureThreshold: 2, cooldownMs: 50 });
  cb.recordFailure();
  cb.recordFailure();
  assert.equal(cb.getState(), 'open');

  await new Promise((r) => setTimeout(r, 80));

  assert.equal(cb.canAttempt(), true);
  assert.equal(cb.getState(), 'half-open');
  // Second caller during half-open is blocked
  assert.equal(cb.canAttempt(), false);

  cb.recordSuccess();
  assert.equal(cb.getState(), 'closed');
  assert.equal(cb.canAttempt(), true);
});

test('re-opens on failure during half-open', async () => {
  const cb = createCircuitBreaker({ name: 'test', failureThreshold: 2, cooldownMs: 50 });
  cb.recordFailure();
  cb.recordFailure();
  assert.equal(cb.getState(), 'open');

  await new Promise((r) => setTimeout(r, 80));

  assert.equal(cb.canAttempt(), true);
  assert.equal(cb.getState(), 'half-open');

  cb.recordFailure();
  assert.equal(cb.getState(), 'open');
  assert.equal(cb.canAttempt(), false);
});

test('CircuitOpenError has the right name', () => {
  const err = new CircuitOpenError();
  assert.equal(err.name, 'CircuitOpenError');
  assert.ok(err instanceof Error);
});

test('isOpen returns false once cooldown expires (ready for half-open test)', async () => {
  const cb = createCircuitBreaker({ name: 'test', failureThreshold: 2, cooldownMs: 50 });
  cb.recordFailure();
  cb.recordFailure();
  assert.equal(cb.isOpen(), true);

  await new Promise((r) => setTimeout(r, 80));
  assert.equal(cb.isOpen(), false);
});
