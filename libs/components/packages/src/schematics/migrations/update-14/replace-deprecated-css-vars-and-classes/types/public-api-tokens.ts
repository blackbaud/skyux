import { PublicApiToken } from './public-api-token';
import { PublicApiTokenGroup } from './public-api-token-group';

export interface PublicApiTokens {
  groups?: PublicApiTokenGroup[];
  tokens?: PublicApiToken[];
}
