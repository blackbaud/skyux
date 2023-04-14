/**
 * @internal
 */
export interface SkyRepeaterAutoScrollOptions {
  margin: number;
  maxSpeed: number;
  scrollWhenOutside: boolean;
  autoScroll(): boolean | undefined;
}
