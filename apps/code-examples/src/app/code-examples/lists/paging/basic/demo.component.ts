import { Component } from '@angular/core';
import { SkyPagingModule } from '@skyux/lists';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyPagingModule],
})
export class DemoComponent {
  protected currentPage = 1;
}
