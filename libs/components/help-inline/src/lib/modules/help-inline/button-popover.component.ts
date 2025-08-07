import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  input,
  output,
} from '@angular/core';
import { SkyPopoverModule } from '@skyux/popovers';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SkyPopoverModule],
  selector: 'sky-help-inline-popover-button',
  styleUrls: [
    './help-inline.default.component.scss',
    './help-inline.modern.component.scss',
  ],
  template: `
    <button
      class="sky-help-inline"
      type="button"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-labelledby]="ariaLabelledby()"
      [skyPopover]="popoverRef"
      (click)="actionClick.emit()"
    >
      <ng-content />
    </button>
    <sky-popover #popoverRef [popoverTitle]="popoverTitle()">
      @if (popoverTemplate(); as template) {
        <ng-container *ngTemplateOutlet="template" />
      } @else {
        <p class="sky-help-inline-popover-text">{{ popoverContent() }}</p>
      }
    </sky-popover>
  `,
})
export class SkyHelpInlinePopoverButtonComponent {
  public actionClick = output<void>();
  public ariaControls = input<string | undefined>();
  public ariaLabel = input<string | undefined>();
  public ariaLabelledby = input<string | undefined>();
  public popoverContent = input.required<string | TemplateRef<unknown>>();
  public popoverTitle = input<string | undefined>();

  protected popoverTemplate = computed(() => {
    const value = this.popoverContent();

    if (value instanceof TemplateRef) {
      return value;
    }

    return undefined;
  });
}
