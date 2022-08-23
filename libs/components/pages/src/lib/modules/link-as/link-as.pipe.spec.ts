import { LinkAsPipe } from './link-as.pipe';

describe('LinkAsPipe', () => {
  it('create an instance', () => {
    const pipe = new LinkAsPipe();
    expect(pipe).toBeTruthy();

    // Button
    expect(pipe.transform({ click: () => {} }, 'button')).toBeTruthy();
    expect(
      pipe.transform(
        { url: 'https://www.example.com', click: () => {} },
        'button'
      )
    ).toBeFalsy();
    expect(
      pipe.transform({ url: 'https://www.example.com' }, 'button')
    ).toBeFalsy();
    expect(
      pipe.transform({ route: { commands: ['test'] } }, 'button')
    ).toBeFalsy();
    expect(pipe.transform({ url: '' }, 'button')).toBeFalsy();
    expect(pipe.transform(undefined, 'button')).toBeFalsy();

    // Href
    expect(
      pipe.transform({ url: 'https://www.example.com' }, 'href')
    ).toBeFalsy();
    expect(pipe.transform({ url: '/path' }, 'href')).toBeTruthy();
    expect(pipe.transform({ url: '' }, 'href')).toBeFalsy();
    expect(pipe.transform(undefined, 'href')).toBeFalsy();

    // SkyAppLink
    expect(
      pipe.transform({ url: 'https://www.example.com' }, 'skyAppLink')
    ).toBeFalsy();
    expect(
      pipe.transform({ route: { commands: ['test'] } }, 'skyAppLink')
    ).toBeTruthy();
    expect(
      pipe.transform(
        {
          url: 'https://www.example.com',
          route: { commands: ['test'] },
        },
        'skyAppLink'
      )
    ).toBeFalsy();
    expect(pipe.transform({ route: undefined }, 'skyAppLink')).toBeFalsy();
    expect(pipe.transform(undefined, 'skyAppLink')).toBeFalsy();

    // SkyHref
    expect(
      pipe.transform({ url: 'https://www.example.com' }, 'skyHref')
    ).toBeTruthy();
    expect(
      pipe.transform({ url: '1bb-nav://spa/path' }, 'skyHref')
    ).toBeTruthy();
    expect(pipe.transform({ url: '/path' }, 'skyHref')).toBeFalsy();
    expect(pipe.transform({ url: '' }, 'skyHref')).toBeFalsy();
    expect(pipe.transform(undefined, 'skyHref')).toBeFalsy();
  });
});
