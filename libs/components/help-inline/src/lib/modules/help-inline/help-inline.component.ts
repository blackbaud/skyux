import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';
import { SkyThemeModule } from '@skyux/theme';

import { SkyHelpInlineResourcesModule } from '../shared/sky-help-inline-resources.module';

import { SkyHelpInlineAriaExpandedPipe } from './help-inline-aria-expanded.pipe';

@Component({
  selector: 'sky-help-inline',
  standalone: true,
  templateUrl: './help-inline.component.html',
  styleUrls: ['./help-inline.component.scss'],
  imports: [
    CommonModule,
    SkyIdModule,
    SkyTrimModule,
    SkyPopoverModule,
    SkyIconModule,
    SkyThemeModule,
    SkyHelpInlineAriaExpandedPipe,
    SkyHelpInlineResourcesModule,
  ],
})
export class SkyHelpInlineComponent {
  @Input()
  public ariaControls: string | undefined;

  @Input()
  public ariaExpanded: boolean | undefined;

  @Input()
  public ariaLabel: string | undefined;

  @Output()
  public actionClick = new EventEmitter<void>();

  public onClick(): void {
    this.actionClick.emit();
  }

  // popover

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
    this.popoverTemplate = value instanceof TemplateRef ? value : undefined;
  }

  protected popoverTemplate: TemplateRef<unknown> | undefined;

  #_popoverContent: string | TemplateRef<unknown> | undefined;
}
