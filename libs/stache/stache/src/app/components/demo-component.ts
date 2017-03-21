export interface StacheDemoComponent {
  name: string;
  summary: string;
  route: string;
  getCodeFiles?: () => any[];
}
