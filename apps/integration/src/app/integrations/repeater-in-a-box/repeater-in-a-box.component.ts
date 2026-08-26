import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyRepeaterModule } from '@skyux/lists';

@Component({
  selector: 'app-repeater-in-a-box',
  imports: [
    SkyFluidGridModule,
    SkyBoxModule,
    SkyRepeaterModule,
    NgTemplateOutlet,
  ],
  templateUrl: './repeater-in-a-box.component.html',
})
export default class RepeaterInABoxComponent {
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
