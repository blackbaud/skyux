import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';

/**
 * Specifies the content to display in the split view's workspace panel.
 */
@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-split-view-workspace-content',
  templateUrl: 'split-view-workspace-content.component.html',
  styleUrls: ['./split-view-workspace-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySplitViewWorkspaceContentComponent {
  @HostBinding('attr.tabindex')
  public tabIndex = '0';
}
