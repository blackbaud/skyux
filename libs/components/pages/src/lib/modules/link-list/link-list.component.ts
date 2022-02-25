import { Component, Input } from '@angular/core';

import { SkyPageLink } from '../action-hub/types/page-link';

@Component({
  selector: 'sky-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class SkyLinkListComponent {
  @Input()
  public links: SkyPageLink[] | 'loading';

  @Input()
  public title: string;
}
