import { SelectionModalPlaygroundPerson } from './selection-modal-playground-person';

export interface SelectionModalPlaygroundSearchResults {
  hasMore: boolean;
  continuationData?: string;
  people: SelectionModalPlaygroundPerson[];
  totalCount: number;
}
