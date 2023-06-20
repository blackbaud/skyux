import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';

@Component({
  selector: 'sky-input-box-help-inline',
  standalone: true,
  imports: [CommonModule, SkyHelpInlineModule, SkyIdModule, SkyPopoverModule],
  templateUrl: './input-box-help-inline.component.html',
})
export class SkyInputBoxHelpInlineComponent {
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
