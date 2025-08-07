import { Person } from './person';

export interface SearchResults {
  hasMore: boolean;
  people: Person[];
  totalCount: number;
}
