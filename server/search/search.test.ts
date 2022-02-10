import { search } from './search';

describe('search', () => {
  test('sample test', () => {
    const result = search('foo');
    expect(result).toBe('foo');
  });
});
