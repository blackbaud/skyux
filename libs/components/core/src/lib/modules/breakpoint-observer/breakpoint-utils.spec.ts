import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';

import {
  isSkyBreakpoint,
  toSkyBreakpoint,
  toSkyMediaBreakpoints,
} from './breakpoint-utils';

describe('breakpoint-utils', () => {
  it('should check if a value is of type SkyBreakpoint', () => {
    expect(isSkyBreakpoint('xs')).toEqual(true);
    expect(isSkyBreakpoint(1)).toEqual(false);
    expect(isSkyBreakpoint(SkyMediaBreakpoints.lg)).toEqual(false);
    expect(isSkyBreakpoint(null)).toEqual(false);
    expect(isSkyBreakpoint(undefined)).toEqual(false);
  });

  it('should transform a `SkyMediaBreakpoints` value to `SkyBreakpoint`', () => {
    expect(toSkyBreakpoint(SkyMediaBreakpoints.xs)).toEqual('xs');
    expect(toSkyBreakpoint(SkyMediaBreakpoints.sm)).toEqual('sm');
    expect(toSkyBreakpoint(SkyMediaBreakpoints.md)).toEqual('md');
    expect(toSkyBreakpoint(SkyMediaBreakpoints.lg)).toEqual('lg');
  });

  it('should transform a `SkyBreakpoint` value to `SkyMediaBreakpoints`', () => {
    expect(toSkyMediaBreakpoints('xs')).toEqual(SkyMediaBreakpoints.xs);
    expect(toSkyMediaBreakpoints('sm')).toEqual(SkyMediaBreakpoints.sm);
    expect(toSkyMediaBreakpoints('md')).toEqual(SkyMediaBreakpoints.md);
    expect(toSkyMediaBreakpoints('lg')).toEqual(SkyMediaBreakpoints.lg);
  });
});
