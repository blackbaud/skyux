import { LookupDemoPerson } from './lookup-demo-person';

export interface LookupAsyncDemoSearchResults {
  hasMore: boolean;
  people: LookupDemoPerson[];
  totalCount: number;
}
