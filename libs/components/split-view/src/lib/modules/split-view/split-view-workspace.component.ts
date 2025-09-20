import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';

import { SkySplitViewWorkspaceHeaderComponent } from './split-view-workspace-header.component';

/**
 * Contains the content, footer, and header to display in the split view's workspace panel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkySplitViewWorkspaceHeaderComponent],
  selector: 'sky-split-view-workspace',
  styleUrl: './split-view-workspace.component.scss',
  templateUrl: './split-view-workspace.component.html',
})
export class SkySplitViewWorkspaceComponent {
  // Use the parent's breakpoint since the mobile header should only appear when
  // the split view container as a whole reaches the "xs" breakpoint, not just
  // the workspace area.
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService, { skipSelf: true }).breakpointChange,
  );

  /**
   * The ARIA label for the workspace panel. This sets the panel's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;
}
