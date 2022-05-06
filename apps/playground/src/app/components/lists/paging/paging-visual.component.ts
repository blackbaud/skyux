import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { SkyPagingModule } from '@skyux/lists';

@Component({
  selector: 'app-paging-visual',
  templateUrl: './paging-visual.component.html',
})
export class PagingVisualComponent {}

@NgModule({
  imports: [CommonModule, SkyPagingModule],
  declarations: [PagingVisualComponent],
  exports: [PagingVisualComponent],
})
export class PagingVisualComponentModule {}
