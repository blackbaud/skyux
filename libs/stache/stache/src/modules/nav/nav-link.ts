export interface StacheNavLink {
  name: string;
  path: string[] | string;
  children?: StacheNavLink[];
  fragment?: string;
  icon?: string;
  summary?: string;
}
