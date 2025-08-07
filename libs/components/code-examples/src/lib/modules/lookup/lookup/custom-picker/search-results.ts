import { Person } from './person';

export interface LookupAsyncDemoSearchResults {
  hasMore: boolean;
  people: Person[];
  totalCount: number;
}
