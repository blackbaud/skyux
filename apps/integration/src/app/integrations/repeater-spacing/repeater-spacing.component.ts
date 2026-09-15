import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  SkyBoxModule,
  SkyFluidGridModule,
  SkyToolbarModule,
} from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyTileContentModule, SkyTileModule } from '@skyux/tiles';

@Component({
  selector: 'app-repeater-spacing',
  imports: [
    SkyFluidGridModule,
    SkyBoxModule,
    SkyRepeaterModule,
    SkyTileModule,
    SkyTileContentModule,
    NgTemplateOutlet,
    SkyToolbarModule,
    SkyIconModule,
    SkyDropdownModule,
    SkyStatusIndicatorModule,
  ],
  templateUrl: './repeater-spacing.component.html',
  styles: `
    .domain-context-menu-col {
      width: 30px;
    }
  `,
})
export default class RepeaterSpacingComponent {
  protected readonly domains = [
    {
      domain_name: 'https://og-int-test.sharedservices-dev.com',
      apple_pay_verified: true,
    },
    {
      domain_name: 'jakeiscool.com',
      apple_pay_verified: false,
    },
  ];
  protected readonly recentActivity = [
    {
      activity: '$250.00 payment processed.',
      date: '08/01/2023 12:02 AM',
    },
    {
      activity: '$150.00 payment processed.',
      date: '05/15/2023 12:02 AM',
    },
    {
      activity: '$250.00 payment processed.',
      date: '02/01/2023 12:02 AM',
    },
  ];
}
