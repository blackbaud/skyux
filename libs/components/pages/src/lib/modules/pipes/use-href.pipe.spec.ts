import { UseHrefPipe } from './use-href.pipe';

describe('UseHrefPipe', () => {
  it('should only pass for relative urls', () => {
    const pipe = new UseHrefPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform({ url: 'https://www.example.com' })).toBeFalsy();
    expect(pipe.transform({ url: '/path' })).toBeTruthy();
    expect(pipe.transform({ url: '' })).toBeFalsy();
    expect(pipe.transform(undefined)).toBeFalsy();
  });
});
