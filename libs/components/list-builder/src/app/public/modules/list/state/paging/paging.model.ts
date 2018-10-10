export class ListPagingModel {
  public itemsPerPage: number;
  public maxDisplayedPages: number;
  public pageCount: number;
  public pageNumber: number;

  constructor(data?: any) {
    if (data !== undefined) {
      this.itemsPerPage = data.itemsPerPage || 10;
      this.maxDisplayedPages = data.maxDisplayedPages || 5;
      this.pageCount = data.pageCount || 0;
      this.pageNumber = data.pageNumber || 1;
    }
  }
}
