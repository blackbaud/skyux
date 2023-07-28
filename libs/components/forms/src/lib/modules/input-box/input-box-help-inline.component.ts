import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';

/**
 * @internal
 */
@Component({
  selector: 'sky-input-box-help-inline',
  standalone: true,
  imports: [
    CommonModule,
    SkyHelpInlineModule,
    SkyI18nModule,
    SkyIdModule,
    SkyPopoverModule,
  ],
  templateUrl: './input-box-help-inline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyInputBoxHelpInlineComponent {
  @Input()
  public labelText: string | undefined;

  @Input()
  public popoverTitle: string | undefined;

  @Input()
  public get popoverContent(): string | TemplateRef<unknown> | undefined {
    return this.#_popoverContent;
  }

  public set popoverContent(value: string | TemplateRef<unknown> | undefined) {
    this.#_popoverContent = value;
    this.popoverContentTemplate =
      value instanceof TemplateRef ? value : undefined;
  }

  protected popoverOpen: boolean | undefined;
  protected popoverContentTemplate: TemplateRef<unknown> | undefined;

  #_popoverContent: string | TemplateRef<unknown> | undefined;

  protected togglePopoverOpen(open: boolean): void {
    this.popoverOpen = open;
  }
}
