import { NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import {
  SkyBoxModule,
  SkyFluidGridModule,
  SkyToolbarModule,
} from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyPageModule } from '@skyux/pages';
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
    SkyPageModule,
    SkyPageModule,
    RouterLink,
  ],
  templateUrl: './repeater-spacing.component.html',
  styles: `
    .domain-context-menu-col {
      width: 30px;
    }
  `,
})
export default class RepeaterSpacingComponent {
  public readonly layout = input<'repeater' | 'toolbar'>();
  public readonly hideNavigation = input(false, {
    transform: booleanAttribute,
  });

  readonly #extraItemCount = 15;

  protected readonly domains = computed(() => {
    const domains = [
      {
        domain_name: 'https://og-int-test.sharedservices-dev.com',
        apple_pay_verified: true,
      },
      {
        domain_name: 'jakeiscool.com',
        apple_pay_verified: false,
      },
    ];

    if (!this.layout()) {
      return domains;
    }

    return [
      ...domains,
      ...Array.from({ length: this.#extraItemCount }, (_, index) => ({
        domain_name: `domain-${index + 1}.example.com`,
        apple_pay_verified: index % 2 === 0,
      })),
    ];
  });
  protected readonly recentActivity = computed(() => {
    const activities = [
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

    if (!this.layout()) {
      return activities;
    }

    return [
      ...activities,
      ...Array.from({ length: this.#extraItemCount }, (_, index) => ({
        activity: `$${(index + 1) * 10}.00 payment processed.`,
        date: '09/01/2023 12:02 AM',
      })),
    ];
  });
}
