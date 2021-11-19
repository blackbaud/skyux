import { Component, Input } from '@angular/core';

import { SkyPageLink } from '../action-hub/types/page-link';

let parentLink: SkyPageLink;

@Component({
  selector: 'sky-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class SkyPageHeaderComponent {
  @Input()
  public parentLink?: typeof parentLink;

  @Input()
  public pageTitle!: string;
}
