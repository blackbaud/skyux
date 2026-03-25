import { PublicApiStyleGroup } from './public-api-style-group.js';
import { PublicApiStyle } from './public-api-style.js';

export interface PublicApiStyles {
  groups?: PublicApiStyleGroup[];
  styles?: PublicApiStyle[];
}
