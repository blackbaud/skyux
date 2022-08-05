import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type Tab = {
  tabHeading: string;
  tabContent: string;
  disabled?: boolean;
  isPermamnent?: boolean;
  tabHeaderCount?: number;
};
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input()
  public active = 0;

  @Input()
  public tabs: Tab[];

  public onNewTabClick() {
    console.log('Add new tab click');
  }

  public onOpenTabClick() {
    console.log('Open tab click');
  }

  public onCloseTab() {
    console.log('Close tab click');
  }
}
