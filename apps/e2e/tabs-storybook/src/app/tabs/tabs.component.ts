import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontLoadingService } from '@skyux/storybook';

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

  public onNewTabClick() {
    console.log('Add new tab click');
  }

  public onOpenTabClick() {
    console.log('Open tab click');
  }

  public onCloseTab(index: number) {
    console.log(`Close tab ${index} click`);
  }

  protected ready = toSignal(inject(FontLoadingService).ready(true));
}
