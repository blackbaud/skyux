import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

let nextTabId = 4;

@Component({
  selector: 'vertical-tabs-visual',
  templateUrl: './vertical-tabs-visual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsVisualComponent {

  public active: boolean = true;

  public group1Disabled: boolean = false;

  public group1Open: boolean = true;

  public group2Disabled: boolean = false;

  public group2Open: boolean = false;

  public group3Disabled: boolean = true;

  public group3Open: boolean = false;

  public tabDisabled: boolean = true;

  public tabs = [
    {
      id: '1',
      heading: 'tab 1',
      content: 'Tab 1 content'
    },
    {
      id: '2',
      heading: 'tab 2',
      content: 'Tab 2 content'
    },
    {
      id: '3',
      heading: 'tab 3',
      content: 'Tab 3 content'
    }
  ];

  public onAddTabClick(): void {
    this.tabs.push({
      id: nextTabId.toString(),
      heading: `tab ${nextTabId}`,
      content: `Tab ${nextTabId} content`
    });
    nextTabId++;
  }

  public onDeleteTabClick(index: number): void {
    this.tabs.splice(index, 1);
  }
}
