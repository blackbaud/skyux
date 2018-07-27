import {
  SkyMediaBreakpoints
} from './media-breakpoints';

export interface SkyMediaQueryListener {
  (args: SkyMediaBreakpoints): void;
}
