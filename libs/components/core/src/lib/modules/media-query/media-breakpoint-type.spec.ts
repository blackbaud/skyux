import {
  isSkyMediaBreakpointType,
  toSkyMediaBreakpointType,
} from './media-breakpoint-type';
import { SkyMediaBreakpoints } from './media-breakpoints';

describe('media-breakpoint-type', () => {
  it('should check if a value is of type SkyMediaBreakpointType', () => {
    expect(isSkyMediaBreakpointType('xs')).toEqual(true);
    expect(isSkyMediaBreakpointType(1)).toEqual(false);
    expect(isSkyMediaBreakpointType(SkyMediaBreakpoints.lg)).toEqual(false);
    expect(isSkyMediaBreakpointType(null)).toEqual(false);
    expect(isSkyMediaBreakpointType(undefined)).toEqual(false);
  });

  it('should transform a `SkyMediaBreakpoints` value to `SkyMediaBreakpointType`', () => {
    expect(toSkyMediaBreakpointType(SkyMediaBreakpoints.xs)).toEqual('xs');
    expect(toSkyMediaBreakpointType(SkyMediaBreakpoints.sm)).toEqual('sm');
    expect(toSkyMediaBreakpointType(SkyMediaBreakpoints.md)).toEqual('md');
    expect(toSkyMediaBreakpointType(SkyMediaBreakpoints.lg)).toEqual('lg');
  });
});
