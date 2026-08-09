const _storage: Record<string, string> = {};

Object.defineProperty(global, "localStorage", {
  value: {
    getItem: (key: string) => _storage[key] ?? null,
    setItem: (key: string, value: string) => { _storage[key] = value; },
    removeItem: (key: string) => { delete _storage[key]; },
    clear: () => { for (const k in _storage) delete _storage[k]; },
    length: 0,
    key: (i: number) => Object.keys(_storage)[i] ?? null,
  },
  configurable: true,
  writable: true,
});
