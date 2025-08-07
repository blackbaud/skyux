import { Component, NgModule } from '@angular/core';
import { SkyPagingContentChangeArgs, SkyPagingModule } from '@skyux/lists';

@Component({
  selector: 'app-paging-visual',
  templateUrl: './paging-visual.component.html',
  standalone: false,
})
export class PagingVisualComponent {
  protected pageNumber = 1;

  public onPageChange(args: SkyPagingContentChangeArgs): void {
    setTimeout(() => {
      this.pageNumber = args.currentPage;
      args.loadingComplete();
    }, 1000);
  }
}

@NgModule({
  imports: [SkyPagingModule],
  declarations: [PagingVisualComponent],
  exports: [PagingVisualComponent],
})
export class PagingVisualComponentModule {}
