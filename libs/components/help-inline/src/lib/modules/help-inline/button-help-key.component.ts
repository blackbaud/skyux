import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SKY_HELP_GLOBAL_OPTIONS, SkyHelpService } from '@skyux/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  selector: 'sky-help-inline-help-key-button',
  standalone: true,
  styleUrls: ['./shared.scss'],
  template: `
    <button
      class="sky-help-inline"
      type="button"
      [attr.aria-controls]="globalOptions?.ariaControls || ariaControls"
      [attr.aria-label]="ariaLabel"
      [attr.aria-labelledby]="ariaLabelledBy"
      [attr.aria-haspopup]="globalOptions?.ariaHaspopup"
      [ngClass]="{
        'sky-help-inline-hidden': !helpSvc
      }"
      (click)="onClick()"
    >
      <ng-content />
    </button>
  `,
})
export class SkyHelpInlineHelpKeyButtonComponent {
  @Input()
  public ariaControls: string | undefined;

  @Input()
  public ariaLabel: string | undefined;

  @Input()
  public ariaLabelledBy: string | undefined;

  @Input()
  public labelText: string | undefined;

  @Input({ required: true })
  public helpKey!: string;

  protected readonly globalOptions = inject(SKY_HELP_GLOBAL_OPTIONS, {
    optional: true,
  });

  protected readonly helpSvc = inject(SkyHelpService, { optional: true });

  protected onClick(): void {
    this.helpSvc?.openHelp({
      helpKey: this.helpKey,
    });
  }
}
