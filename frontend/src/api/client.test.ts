jest.mock('axios', () => {
  const requestHandlers: Array<{ fulfilled: (cfg: any) => any }> = [];

  const instance: any = {
    interceptors: {
      request: {
        handlers: requestHandlers,
        use: (fn: (cfg: any) => any) => {
          requestHandlers.push({ fulfilled: fn });
        },
      },
      response: { handlers: [], use: () => {} },
    },
    defaults: {},
    create: (cfg: any) => {
      instance.defaults = { baseURL: cfg.baseURL };
      return instance;
    },
  };

  return { __esModule: true, default: instance };
});

import api from './client';

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('set baseURL dari env', () => {
    expect(api.defaults.baseURL).toMatch(/\/api$/);
  });

  it('menyisipkan header Authorization dari localStorage', () => {
    localStorage.setItem('token', 'abc123');
    const cfg = { headers: {} as any };

    // CAST ke any supaya TS tidak complain
    const anyApi = api as any;
    const handlers = anyApi.interceptors.request.handlers as Array<{
      fulfilled: (c: any) => any;
    }>;

    const newCfg = handlers[0].fulfilled(cfg);
    expect(newCfg.headers.Authorization).toBe('Bearer abc123');
  });
});