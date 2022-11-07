import { Component, Input } from '@angular/core';

import { SkyPageLink } from '../action-hub/types/page-link';
import { SkyPageLinksInput } from '../action-hub/types/page-links-input';

@Component({
  selector: 'sky-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class SkyLinkListComponent {
  @Input()
  public set links(value: SkyPageLinksInput | undefined) {
    this.#_links = value;
    this.linksArray = Array.isArray(value) ? value : [];
  }

  public get links(): SkyPageLinksInput | undefined {
    return this.#_links;
  }

  @Input()
  public title: string | undefined;

  public linksArray: SkyPageLink[] = [];

  #_links: SkyPageLinksInput | undefined;
}
