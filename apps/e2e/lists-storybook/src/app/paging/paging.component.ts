import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
  standalone: false,
})
export class PagingComponent {
  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
