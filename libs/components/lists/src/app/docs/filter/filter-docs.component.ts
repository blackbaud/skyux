import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

@Component({
  selector: 'app-filter-docs',
  templateUrl: './filter-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterDocsComponent {

  public demoSettings: any = {};

  public filterTypeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'modal', label: 'Modal filter' },
    { value: 'inline', label: 'Inline filter' }
  ];

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.filterType) {
      this.demoSettings.filterType = change.filterType;
    }
  }

}
