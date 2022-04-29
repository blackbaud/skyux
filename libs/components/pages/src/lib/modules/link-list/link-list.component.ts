import { Component, Input } from '@angular/core';

import { SkyPageLinksInput } from '../action-hub/types/page-links-input';

@Component({
  selector: 'sky-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class SkyLinkListComponent {
  @Input()
  public links: SkyPageLinksInput;

  @Input()
  public title: string;
}
