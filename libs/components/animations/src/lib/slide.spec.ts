import { skyAnimationSlide } from './slide';

describe('Animation slide', () => {
  it('should define an animation trigger', () => {
    // We type as `any` here to get to internal properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const definitions: any = skyAnimationSlide.definitions;

    expect(skyAnimationSlide.name).toEqual('skyAnimationSlide');
    expect(definitions[0].name).toEqual('down');
    expect(definitions[1].name).toEqual('up');
    expect(definitions[2].expr).toEqual('up <=> down');
    expect(definitions[2].animation.timings).toEqual('150ms ease-in');
  });
});
