import { SkyViewkeeperOffset } from './viewkeeper-offset';

export interface SkyViewkeeperBoundaryInfo {
  elHeight: number;

  spacerEl: HTMLElement | null;

  spacerId: string;

  boundaryBottom: number;

  boundaryOffset: SkyViewkeeperOffset;

  boundaryEl: HTMLElement;

  scrollLeft: number;

  scrollTop: number;
}
