import {
  ListToolbarConfigSetSearchEnabledAction,
  ListToolbarConfigSetSortSelectorEnabledAction
} from './config/actions';

export type ListToolbarStateAction =
  ListToolbarConfigSetSearchEnabledAction | ListToolbarConfigSetSortSelectorEnabledAction;
