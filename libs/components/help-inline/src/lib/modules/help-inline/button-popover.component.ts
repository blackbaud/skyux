import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { SkyIdService } from '@skyux/core';
import { SkyPopoverModule } from '@skyux/popovers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, SkyPopoverModule],
  selector: 'sky-help-inline-popover-button',
  standalone: true,
  styleUrls: ['./shared.scss'],
  template: `
    <button
      class="sky-help-inline"
      type="button"
      [attr.aria-controls]="popoverId || ariaControls"
      [attr.aria-expanded]="isPopoverOpened"
      [attr.aria-label]="ariaLabel"
      [attr.aria-labelledby]="ariaLabelledBy"
      [skyPopover]="popoverRef"
    >
      <ng-content />
    </button>
    <sky-popover
      [id]="popoverId"
      [popoverTitle]="popoverTitle"
      (popoverClosed)="popoverOpened(false)"
      (popoverOpened)="popoverOpened(true)"
      #popoverRef
    >
      @if (popoverTemplate) {
        <ng-container *ngTemplateOutlet="popoverTemplate" />
      } @else {
        {{ popoverContent }}
      }
    </sky-popover>
  `,
})
export class SkyHelpInlinePopoverButtonComponent {
  @Input()
  public ariaControls: string | undefined;

  @Input()
  public ariaLabel: string | undefined;

  @Input()
  public ariaLabelledBy: string | undefined;

  @Input()
  public labelText: string | undefined;

  @Input({ required: true })
  public get popoverContent(): string | TemplateRef<unknown> {
    return this.#_popoverContent;
  }

  public set popoverContent(value: string | TemplateRef<unknown>) {
    this.#_popoverContent = value;

    if (value) {
      this.popoverId = this.#idSvc.generateId();
      this.isPopoverOpened = false;
    }

    this.popoverTemplate = value instanceof TemplateRef ? value : undefined;
  }

  @Input()
  public popoverTitle: string | undefined;

  protected popoverId: string | undefined;
  protected popoverTemplate: TemplateRef<unknown> | undefined;
  protected isPopoverOpened: boolean | undefined;

  #_popoverContent!: string | TemplateRef<unknown>;

  readonly #idSvc = inject(SkyIdService);

  protected popoverOpened(flag: boolean): void {
    this.isPopoverOpened = flag;
  }
}
