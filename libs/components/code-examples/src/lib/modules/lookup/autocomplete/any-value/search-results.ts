import { ColorOption } from './color-option';

export interface SearchResults {
  hasMore: boolean;
  colors: ColorOption[];
  totalCount: number;
}
