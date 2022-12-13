import { RepeaterDemoItem } from './repeater-demo-item';

export interface SortOption {
  id: number;
  label: string;
  name: keyof RepeaterDemoItem;
  descending: boolean;
}
