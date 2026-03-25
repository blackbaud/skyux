import { PublicApiToken } from './public-api-token.js';

export interface PublicApiTokenGroup {
  groupName: string;
  description?: string;
  groups?: PublicApiTokenGroup[];
  tokens?: PublicApiToken[];
}
