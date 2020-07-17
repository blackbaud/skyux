export interface StacheNavLink {
  name: string;
  path: string[] | string;
  order?: number;
  offsetTop?: number;
  children?: StacheNavLink[];
  fragment?: string;
  icon?: string;
  summary?: string;
  isActive?: boolean;
  isCurrent?: boolean;
  showInNav?: boolean;
  restricted?: boolean;
}
