import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

@Component({
  selector: 'app-description-list-docs',
  templateUrl: './description-list-docs.component.html'
})
export class DescriptionListDocsComponent {

  public demoSettings: any = {};

  public nameValueItems: { term: string, description: string }[] = [
    {
      term: 'College',
      description: 'Humanities and Social Sciences'
    },
    {
      term: 'Department',
      description: 'Anthropology'
    },
    {
      term: 'Advisor',
      description: 'Calandra Geer'
    },
    {
      term: 'Class year',
      description: '2024'
    }
  ];

  public layoutChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'longDescription', label: 'Long description' }
  ];

  public longDescriptionItems: { term: string, description: string }[] = [
    {
      term: 'Good Health and Well-being',
      description: 'Ensure healthy lives and promote well-being for all at all ages.'
    },
    {
      term: 'Quality Education',
      description: 'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.'
    },
    {
      term: 'Gender Equity',
      description: 'Achieve gender equality and empower all women and girls.'
    }
  ];

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.mode !== undefined) {
      this.demoSettings.mode = change.mode;
    }
  }

}
