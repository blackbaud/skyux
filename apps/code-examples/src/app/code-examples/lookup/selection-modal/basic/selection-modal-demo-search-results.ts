import { SelectionModalDemoPerson } from './selection-modal-demo-person';

export interface SelectionModalAsyncDemoSearchResults {
  hasMore: boolean;
  people: SelectionModalDemoPerson[];
  totalCount: number;
}
