import { EXAMPLES_REGISTRY } from '../src/examples/registry';

describe('Example Registry Integrity', () => {
  it('contains exactly 13 reference examples', () => {
    expect(EXAMPLES_REGISTRY).toHaveLength(13);
  });

  it('has unique IDs for every registered example', () => {
    const ids = EXAMPLES_REGISTRY.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has unique routes for every registered example', () => {
    const routes = EXAMPLES_REGISTRY.map((item) => item.route);
    const uniqueRoutes = new Set(routes);
    expect(uniqueRoutes.size).toBe(routes.length);
  });

  it('ensures every example has non-empty title', () => {
    for (const item of EXAMPLES_REGISTRY) {
      expect(item.title.trim().length).toBeGreaterThan(0);
    }
  });
});
