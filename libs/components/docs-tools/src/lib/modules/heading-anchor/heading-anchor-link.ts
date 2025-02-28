import { SkyDocsPillColor } from '../pill/pill-color';

/**
 * @internal
 */
export interface SkyHeadingAnchorLink {
  anchorId: string;
  categoryColor?: SkyDocsPillColor;
  categoryText?: string;
  text: string;
}
