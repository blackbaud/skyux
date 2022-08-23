import { LinkAsPipe } from './link-as.pipe';

describe('LinkAsPipe', () => {
  it('create an instance', () => {
    const pipe = new LinkAsPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(undefined, undefined)).toBeFalsy();
  });

  it('should validate when linkAs is button', () => {
    const pipe = new LinkAsPipe();
    expect(
      pipe.transform({ title: 'Action', click: () => {} }, 'button')
    ).toBeTruthy();
    expect(
      pipe.transform(
        {
          title: 'Action',
          permalink: { url: 'https://www.example.com' },
          click: () => {},
        },
        'button'
      )
    ).toBeFalsy();
    expect(
      pipe.transform(
        { title: 'Action', permalink: { url: 'https://www.example.com' } },
        'button'
      )
    ).toBeFalsy();
    expect(
      pipe.transform(
        { title: 'Action', permalink: { route: { commands: ['test'] } } },
        'button'
      )
    ).toBeFalsy();
    expect(
      pipe.transform({ title: 'Action', permalink: { url: '' } }, 'button')
    ).toBeFalsy();
    expect(pipe.transform(undefined, 'button')).toBeFalsy();
    expect(
      pipe.transform({ label: 'Link', permalink: { url: 'invalid' } }, 'button')
    ).toBeFalsy();
  });

  it('should validate when linkAs is href', () => {
    const pipe = new LinkAsPipe();
    expect(
      pipe.transform(
        { label: 'Link', permalink: { url: 'https://www.example.com' } },
        'href'
      )
    ).toBeFalsy();
    expect(
      pipe.transform({ label: 'Link', permalink: { url: '/path' } }, 'href')
    ).toBeTruthy();
    expect(
      pipe.transform({ label: 'Link', permalink: { url: '' } }, 'href')
    ).toBeTruthy();
    expect(
      pipe.transform({ label: 'Link', permalink: undefined }, 'href')
    ).toBeFalsy();
    expect(pipe.transform(undefined, 'href')).toBeFalsy();
  });

  it('should validate when linkAs is skyAppLink', () => {
    const pipe = new LinkAsPipe();
    expect(
      pipe.transform(
        { label: 'Link', permalink: { url: 'https://www.example.com' } },
        'skyAppLink'
      )
    ).toBeFalsy();
    expect(
      pipe.transform(
        { label: 'Link', permalink: { route: { commands: ['test'] } } },
        'skyAppLink'
      )
    ).toBeTruthy();
    expect(
      pipe.transform(
        {
          label: 'Link',
          permalink: {
            url: 'https://www.example.com',
            route: { commands: ['test'] },
          },
        },
        'skyAppLink'
      )
    ).toBeFalsy();
    expect(
      pipe.transform(
        { label: 'Link', permalink: { route: undefined } },
        'skyAppLink'
      )
    ).toBeFalsy();
    expect(
      pipe.transform({ label: 'Link', permalink: undefined }, 'skyAppLink')
    ).toBeFalsy();
    expect(pipe.transform(undefined, 'skyAppLink')).toBeFalsy();
  });

  it('should validate when linkAs is skyHref', () => {
    const pipe = new LinkAsPipe();
    expect(
      pipe.transform(
        { label: 'Link', permalink: { url: 'https://www.example.com' } },
        'skyHref'
      )
    ).toBeTruthy();
    expect(
      pipe.transform(
        { label: 'Link', permalink: { url: '1bb-nav://spa/path' } },
        'skyHref'
      )
    ).toBeTruthy();
    expect(
      pipe.transform({ label: 'Link', permalink: { url: '/path' } }, 'skyHref')
    ).toBeFalsy();
    expect(
      pipe.transform({ label: 'Link', permalink: { url: '' } }, 'skyHref')
    ).toBeFalsy();
    expect(
      pipe.transform({ label: 'Link', permalink: undefined }, 'skyHref')
    ).toBeFalsy();
    expect(pipe.transform(undefined, 'skyHref')).toBeFalsy();
  });
});
