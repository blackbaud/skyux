import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { SKY_HELP_GLOBAL_OPTIONS, SkyHelpService } from '@skyux/core';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  selector: 'sky-help-inline-help-key-button',
  styleUrls: [
    './help-inline.default.component.scss',
    './help-inline.modern.component.scss',
  ],
  template: `
    <button
      class="sky-help-inline"
      type="button"
      [attr.aria-controls]="
        (helpSvc?.widgetReadyStateChange | async)
          ? globalOptions?.ariaControls
          : null
      "
      [attr.aria-haspopup]="globalOptions?.ariaHaspopup"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [ngClass]="{
        'sky-help-inline-hidden': !helpSvc,
      }"
      (click)="openHelpKey()"
    >
      <ng-content />
    </button>
  `,
})
export class SkyHelpInlineHelpKeyButtonComponent {
  public actionClick = output<void>();
  public ariaLabel = input<string | undefined>();
  public ariaLabelledby = input<string | undefined>();
  public helpKey = input.required<string>();

  protected readonly globalOptions = inject(SKY_HELP_GLOBAL_OPTIONS, {
    optional: true,
  });

  protected readonly helpSvc = inject(SkyHelpService, { optional: true });

  protected openHelpKey(): void {
    this.actionClick.emit();

    this.helpSvc?.openHelp({
      helpKey: this.helpKey(),
    });
  }
}
