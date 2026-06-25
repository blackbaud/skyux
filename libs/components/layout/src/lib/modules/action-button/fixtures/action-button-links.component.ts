import { Component, OnInit, ViewChild } from '@angular/core';

import { SkyActionButtonContainerComponent } from '../action-button-container.component';
import { SkyActionButtonPermalink } from '../action-button-permalink';

@Component({
  selector: 'sky-action-button-skyhref',
  templateUrl: './action-button-links.component.html',
  standalone: false,
})
export class ActionButtonLinksComponent implements OnInit {
  @ViewChild(SkyActionButtonContainerComponent, {
    read: SkyActionButtonContainerComponent,
    static: true,
  })
  public actionButtonContainer: SkyActionButtonContainerComponent | undefined;

  public permalink: string | undefined;
  public items:
    | {
        header: string;
        details: string;
        permalink: SkyActionButtonPermalink;
      }[]
    | undefined;
  public firstButtonHeight: string | undefined;

  public ngOnInit(): void {
    this.items = [
      {
        header: 'Action button',
        details:
          'The action button module creates a large button with an icon, heading, and details.',
        permalink: { url: this.permalink },
      },
      {
        header: 'Alert',
        details:
          'The alert component highlights critical information that users must see.',
        permalink: { url: this.permalink },
      },
      {
        header: 'Autocomplete',
        details:
          'The autocomplete component creates a text input that filters data based on user entries.',
        permalink: { url: this.permalink },
      },
    ];
  }
}
