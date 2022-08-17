import { UseSkyAppLinkPipe } from './use-sky-app-link.pipe';

describe('UseSkyAppLinkPipe', () => {
  it('create an instance', () => {
    const pipe = new UseSkyAppLinkPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform({ url: 'https://www.example.com' })).toBeFalsy();
    expect(pipe.transform({ route: { commands: ['test'] } })).toBeTruthy();
    expect(
      pipe.transform({
        url: 'https://www.example.com',
        route: { commands: ['test'] },
      })
    ).toBeFalsy();
    expect(pipe.transform({ route: undefined })).toBeFalsy();
    expect(pipe.transform(undefined)).toBeFalsy();
  });
});
