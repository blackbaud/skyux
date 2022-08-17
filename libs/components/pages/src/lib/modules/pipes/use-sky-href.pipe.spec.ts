import { UseSkyHrefPipe } from './use-sky-href.pipe';

describe('UseSkyHrefPipe', () => {
  it('should only pass for urls with protocol', () => {
    const pipe = new UseSkyHrefPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform({ url: 'https://www.example.com' })).toBeTruthy();
    expect(pipe.transform({ url: '1bb-nav://spa/path' })).toBeTruthy();
    expect(pipe.transform({ url: '/path' })).toBeFalsy();
    expect(pipe.transform({ url: '' })).toBeFalsy();
    expect(pipe.transform(undefined)).toBeFalsy();
  });
});
