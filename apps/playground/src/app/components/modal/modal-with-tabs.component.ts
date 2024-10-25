import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';
import { SkyTabsModule } from '@skyux/tabs';

@Component({
  standalone: true,
  selector: 'app-modal-tabs',
  templateUrl: './modal-with-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyModalModule, SkyTabsModule],
})
export class ModalWithTabsComponent {
  public newTabClick() {}

  public openTabClick() {}

  public closeTab() {}
}
