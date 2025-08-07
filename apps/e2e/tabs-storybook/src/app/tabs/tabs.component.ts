import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface Tab {
  tabHeading: string;
  tabContent: string;
  disabled?: boolean;
  isPermanent?: boolean;
  tabHeaderCount?: number;
}
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TabsComponent {
  @Input()
  public active: number | undefined = 0;

  @Input()
  public tabs: Tab[] | undefined = [];

  public onNewTabClick(): void {
    console.log('Add new tab click');
  }

  public onOpenTabClick(): void {
    console.log('Open tab click');
  }

  public onCloseTab(index: number): void {
    console.log(`Close tab ${index} click`);
  }
}
