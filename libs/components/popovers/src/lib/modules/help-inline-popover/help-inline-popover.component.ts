import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyHelpInlineModule } from '@skyux/indicators';

import { SkyPopoverModule } from '../popover/popover.module';

/**
 * @internal
 */
@Component({
  selector: 'sky-help-inline-popover',
  standalone: true,
  templateUrl: './help-inline-popover.component.html',
  styleUrls: ['./help-inline-popover.component.scss'],
  imports: [
    CommonModule,
    SkyIdModule,
    SkyHelpInlineModule,
    SkyTrimModule,
    SkyPopoverModule,
    SkyI18nModule,
  ],
})
export class SkyHelpInlinePopoverComponent {
  @Input()
  public labelText: string | undefined;

  @Input()
  public helpPopoverTitle: string | undefined;

  @Input()
  public get helpPopoverContent(): string | TemplateRef<unknown> | undefined {
    return this.#_popoverContent;
  }

  public set helpPopoverContent(
    value: string | TemplateRef<unknown> | undefined,
  ) {
    this.#_popoverContent = value;
    this.popoverTemplate = value instanceof TemplateRef ? value : undefined;
  }

  protected popoverTemplate: TemplateRef<unknown> | undefined;

  #_popoverContent: string | TemplateRef<unknown> | undefined;
}
