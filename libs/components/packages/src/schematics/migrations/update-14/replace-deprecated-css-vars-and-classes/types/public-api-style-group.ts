import { PublicApiStyle } from './public-api-style.js';

export interface PublicApiStyleGroup {
  name: string;
  description?: string;
  groups?: PublicApiStyleGroup[];
  styles?: PublicApiStyle[];
  imageToken?: string;
}
