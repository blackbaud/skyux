import { PublicApiToken } from './public-api-token';

export interface PublicApiTokenGroup {
  groupName: string;
  description?: string;
  groups?: PublicApiTokenGroup[];
  tokens?: PublicApiToken[];
}
