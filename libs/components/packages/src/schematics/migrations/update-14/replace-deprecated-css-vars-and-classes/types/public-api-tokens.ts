import { PublicApiTokenGroup } from './public-api-token-group.js';
import { PublicApiToken } from './public-api-token.js';

export interface PublicApiTokens {
  groups?: PublicApiTokenGroup[];
  tokens?: PublicApiToken[];
}
