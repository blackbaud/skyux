import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import {
  SkyDescriptionListModeType,
  SkyDescriptionListModule,
} from '@skyux/layout';

@Component({
  selector: 'sky-description-list-fixture',
  templateUrl: './description-list-test.component.html',
  imports: [SkyDescriptionListModule, SkyHelpInlineModule],
})
export class DescriptionListHarnessTestComponent {
  public mode: SkyDescriptionListModeType = 'vertical';

  protected items: {
    term?: string;
    description?: string;
    hideDescription?: boolean;
    helpContent?: string;
    helpTitle?: string;
    helpKey?: string;
    dataSkyId?: string;
  }[] = [
    {
      term: 'College',
      description: 'Humanities and Social Sciences',
    },
    {
      term: 'Department',
    },
    {
      description: 'Anthropology',
      hideDescription: true,
    },
    {
      term: 'Advisor',
      description: 'Cathy Green',
      helpContent: 'The faculty member who advises the student.',
      helpTitle: 'Help inline title',
    },
    {
      term: 'Class year',
      description: '2024',
      helpKey: 'helpKey.html',
    },
  ];

  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
