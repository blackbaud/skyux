import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies the footer to display in the split view's workspace panel. This component is often used with a summary action bar.
 */
@Component({
  selector: 'sky-split-view-workspace-footer',
  templateUrl: 'split-view-workspace-footer.component.html',
  styleUrls: ['./split-view-workspace-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkySplitViewWorkspaceFooterComponent {}
