import { PublicApiStyle } from './public-api-style';

export interface PublicApiStyleGroup {
  name: string;
  description?: string;
  groups?: PublicApiStyleGroup[];
  styles?: PublicApiStyle[];
  imageToken?: string;
}
