import { Component } from '@angular/core';

@Component({
  selector: 'app-paging-demo',
  templateUrl: './paging-demo.component.html',
})
export class PagingDemoComponent {
  public currentPage: number = 1;
}
