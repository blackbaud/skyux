import {
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

import {
  of
} from 'rxjs';

@Component({
  selector: 'app-list-view-checklist-docs',
  templateUrl: './list-view-checklist-docs.component.html'
})
export class ListViewChecklistDocsComponent {

  public demoSettings: any = {};

  public items = of([
    { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples'},
    { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
    { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
    { id: '4', column1: 404, column2: 'Grape', column3: 'George eats grapes' },
    { id: '5', column1: 505, column2: 'Banana', column3: 'Becky eats bananas' },
    { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
    { id: '7', column1: 707, column2: 'Strawberry', column3: 'Sally eats strawberries' }
  ]);

  public selectedIds: string[] = [];

  public selectModeChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'multiple', label: 'Multiple select mode' },
    { value: 'single', label: 'Single select mode' }
  ];

  public onDemoReset(): void {
    this.selectedIds = [];
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.selectMode) {
      this.selectedIds = [];
      this.demoSettings.selectMode = change.selectMode;
    }
  }

}
