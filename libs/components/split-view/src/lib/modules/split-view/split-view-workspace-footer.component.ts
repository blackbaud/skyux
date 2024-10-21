import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';

/**
 * Specifies the footer to display in the split view's workspace panel. This component is often used with a summary action bar.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SkyResponsiveHostDirective],
  selector: 'sky-split-view-workspace-footer',
  standalone: true,
  styleUrl: './split-view-workspace-footer.component.scss',
  templateUrl: './split-view-workspace-footer.component.html',
})
export class SkySplitViewWorkspaceFooterComponent {}
