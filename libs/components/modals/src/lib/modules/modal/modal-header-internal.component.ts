import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  input,
} from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyHelpInlineModule],
  selector: 'sky-modal-header-internal',
  styleUrl: './modal-header.component.scss',
  templateUrl: './modal-header-internal.component.html',
})
export class SkyModalHeaderInternalComponent {
  public readonly headingText = input.required<string>();
  public readonly helpKey = input<string>();
  public readonly helpPopoverContent = input<string | TemplateRef<unknown>>();
  public readonly helpPopoverTitle = input<string>();
}
