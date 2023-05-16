import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { SkyPageHeaderModule } from '../page-header.module';

@Component({
  selector: 'sky-page-header-fixtures',
  standalone: true,
  imports: [CommonModule, SkyPageHeaderModule],
  templateUrl: './page-header-fixtures.component.html',
})
export class PageHeaderFixturesComponent {
  protected spokeTitle = 'Page Title';
  protected hubLink = {
    label: 'Parent Link',
    permalink: {
      url: '#',
    },
  };

  protected headerContent: string | undefined;
}
