import { config } from '../src/config';

describe('Config', () => {
  it('has a default API key', () => {
    expect(config.apiKey).toBeDefined();
  });
});
