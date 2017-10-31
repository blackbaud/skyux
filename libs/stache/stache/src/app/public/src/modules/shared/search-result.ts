export interface StacheSearchResult {
  document: {
    title: string;
    site_name: string;
    host: string;
    path: string;
    text: string;
  };
  highlights?: {
    text: string[]
  };

}
