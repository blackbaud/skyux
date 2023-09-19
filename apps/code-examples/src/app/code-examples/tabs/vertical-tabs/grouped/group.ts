export interface TabGroup {
  heading: string;
  isOpen: boolean;
  isDisabled: boolean;
  subTabs: {
    tabHeading: string;
    content: string;
    tabHeaderCount?: number;
    active?: boolean;
    disabled?: boolean;
  }[];
}
