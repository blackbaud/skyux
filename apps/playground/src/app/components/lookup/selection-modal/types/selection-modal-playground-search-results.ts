import { SelectionModalPlaygroundPerson } from './selection-modal-playground-person';

export interface SelectionModalPlaygroundSearchResults {
  hasMore: boolean;
  people: SelectionModalPlaygroundPerson[];
  totalCount: number;
}
