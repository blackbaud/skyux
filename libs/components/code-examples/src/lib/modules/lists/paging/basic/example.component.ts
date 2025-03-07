import { Component } from '@angular/core';
import { SkyPagingModule } from '@skyux/lists';

/**
 * @title Paging with basic setup
 */
@Component({
  selector: 'app-lists-paging-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyPagingModule],
})
export class ListsPagingBasicExampleComponent {
  protected currentPage = 1;
}
