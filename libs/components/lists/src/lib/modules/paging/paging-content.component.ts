import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'sky-paging-content',
  template: `<ng-content />`,
})
export class SkyPagingContentComponent {}
