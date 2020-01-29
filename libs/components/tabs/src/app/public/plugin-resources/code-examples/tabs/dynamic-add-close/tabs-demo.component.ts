import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-tabs-demo',
  templateUrl: './tabs-demo.component.html'
})
export class TabsDemoComponent {

  public tabArray = [
    {
      tabHeading: 'Tab 1',
      tabContent: 'Content for Tab 1'
    },
    {
      tabHeading: 'Tab 2',
      tabContent: 'Content for Tab 2'
    },
    {
      tabHeading: 'Tab 3',
      tabContent: 'Content for Tab 3'
    }
  ];

  private tabCounter: number = 3;

  public onNewTabClick(): void {
    this.tabCounter++;

    this.tabArray.push({
      tabHeading: 'Tab ' + this.tabCounter,
      tabContent: 'Content for Tab' + this.tabCounter
    });
  }

  public onCloseClick(arrayIndex: number): void {
    this.tabArray.splice(arrayIndex, 1);
  }
}
