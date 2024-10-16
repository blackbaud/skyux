import { SkyMediaBreakpoints } from '../media-breakpoints';

import {
  isSkyBreakpointType,
  toSkyBreakpointType,
  toSkyMediaBreakpoints,
} from './breakpoint-utils';

describe('media-breakpoint-type', () => {
  it('should check if a value is of type SkyBreakpointType', () => {
    expect(isSkyBreakpointType('xs')).toEqual(true);
    expect(isSkyBreakpointType(1)).toEqual(false);
    expect(isSkyBreakpointType(SkyMediaBreakpoints.lg)).toEqual(false);
    expect(isSkyBreakpointType(null)).toEqual(false);
    expect(isSkyBreakpointType(undefined)).toEqual(false);
  });

  it('should transform a `SkyMediaBreakpoints` value to `SkyBreakpointType`', () => {
    expect(toSkyBreakpointType(SkyMediaBreakpoints.xs)).toEqual('xs');
    expect(toSkyBreakpointType(SkyMediaBreakpoints.sm)).toEqual('sm');
    expect(toSkyBreakpointType(SkyMediaBreakpoints.md)).toEqual('md');
    expect(toSkyBreakpointType(SkyMediaBreakpoints.lg)).toEqual('lg');
  });

  it('should transform a `SkyBreakpointType` value to `SkyMediaBreakpoints`', () => {
    expect(toSkyMediaBreakpoints('xs')).toEqual(SkyMediaBreakpoints.xs);
    expect(toSkyMediaBreakpoints('sm')).toEqual(SkyMediaBreakpoints.sm);
    expect(toSkyMediaBreakpoints('md')).toEqual(SkyMediaBreakpoints.md);
    expect(toSkyMediaBreakpoints('lg')).toEqual(SkyMediaBreakpoints.lg);
  });
});
