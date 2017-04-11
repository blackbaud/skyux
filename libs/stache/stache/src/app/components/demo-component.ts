export interface StacheDemoComponent {
  name: string;
  summary: string;
  icon: string;
  route: string;
  getCodeFiles?: () => any[];
}
