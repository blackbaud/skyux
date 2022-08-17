import { UseButtonPipe } from './use-button.pipe';

describe('UseButtonPipe', () => {
  it('create an instance', () => {
    const pipe = new UseButtonPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform({ click: () => {} })).toBeTruthy();
    expect(
      pipe.transform({ url: 'https://www.example.com', click: () => {} })
    ).toBeFalsy();
    expect(pipe.transform({ url: 'https://www.example.com' })).toBeFalsy();
    expect(pipe.transform({ route: { commands: ['test'] } })).toBeFalsy();
    expect(pipe.transform({ url: '' })).toBeFalsy();
    expect(pipe.transform(undefined)).toBeFalsy();
  });
});
