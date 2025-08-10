import { sanitizeUrl } from './sanitizeUrl';

describe('sanitizeUrl', () => {
  it('removes protocol and slashes', () => {
    expect(sanitizeUrl('https://example.com/')).toBe('example.com');
  });

  it('removes all slashes from path', () => {
    expect(sanitizeUrl('http://example.com/foo/bar')).toBe('example.comfoobar');
  });
});
