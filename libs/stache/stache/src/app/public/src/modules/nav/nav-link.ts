export interface StacheNavLink {
  name: string;
  path: string[] | string;
  order?: number;
  children?: StacheNavLink[];
  fragment?: string;
  icon?: string;
  summary?: string;
}
