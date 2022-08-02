import { Component } from '@angular/core';

@Component({
  selector: 'app-page-header-visual',
  templateUrl: './page-header-visual.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class PageHeaderVisualComponent {
  public pageTitle = 'Page Title';
  public parentLink = {
    label: 'Parent Link',
    permalink: {
      url: '#',
    },
  };
  public spokeTitleLong =
    'Page Title has extra words that some might think go too far';
  public hubLinkLong = {
    label: 'Parent Link with a Title that has More Words than you might expect',
    permalink: {
      url: '#',
    },
  };
}
