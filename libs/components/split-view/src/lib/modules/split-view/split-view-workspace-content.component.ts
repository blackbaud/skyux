import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';

/**
 * Specifies the content to display in the split view's workspace panel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    tabindex: '0',
  },
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-split-view-workspace-content',
  standalone: true,
  styleUrl: './split-view-workspace-content.component.scss',
  templateUrl: './split-view-workspace-content.component.html',
})
export class SkySplitViewWorkspaceContentComponent {}
