import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { api, ApiError } from './api';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

describe('api client', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('sends the session as a cookie: same-origin credentials, no Authorization header', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { success: true, data: { id: 'x' } }));
    await api.auth.me();
    const [, init] = fetchMock.mock.calls[0]!;
    expect(init.credentials).toBe('same-origin');
    expect(init.headers.Authorization).toBeUndefined();
  });

  it('unwraps the data field of a successful response', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { success: true, data: { expiresAt: 'soon' } }));
    await expect(api.auth.refresh()).resolves.toEqual({ expiresAt: 'soon' });
  });

  it('throws an ApiError with the server message on failure', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(400, { success: false, error: 'Time is up' }));
    const err = await api.mock.saveAnswer('e1', { mockQuestionId: 'q', answer: 'A' }).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(400);
    expect(err.message).toBe('Time is up');
  });

  it('login returns the user and expiry, not a token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { success: true, data: { user: { id: 'u' }, expiresAt: 'later' } }));
    const data = await api.auth.login({ email: 'a@b.co', password: 'pw-123456' });
    expect(data).toEqual({ user: { id: 'u' }, expiresAt: 'later' });
    expect('token' in data).toBe(false);
  });
});
