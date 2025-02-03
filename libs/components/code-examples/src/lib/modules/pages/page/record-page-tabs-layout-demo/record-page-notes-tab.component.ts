import { Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyRepeaterModule, SkySortModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-record-page-notes-tab',
  templateUrl: './record-page-notes-tab.component.html',
  imports: [
    SkyDropdownModule,
    SkyIconModule,
    SkyKeyInfoModule,
    SkyRepeaterModule,
    SkySearchModule,
    SkySortModule,
    SkyToolbarModule,
  ],
})
export class RecordPageNotesTabComponent {
  protected notes = [
    {
      noteNumber: 1,
      content: 'Attended our gala last year and had a great time.',
      date: '11/17/2024',
    },
    {
      noteNumber: 2,
      content:
        'Is a business owner and has a lot of connections in the community.',
      date: '10/11/2024',
    },
  ];
}
