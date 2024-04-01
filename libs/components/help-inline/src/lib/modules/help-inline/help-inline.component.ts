import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';

import { SkyHelpInlineAriaExpandedPipe } from './help-inline-aria-expanded.pipe';
import { SkyHelpInlineModule } from './help-inline.module';

@Component({
  selector: 'sky-help-inline',
  standalone: true,
  templateUrl: './help-inline.component.html',
  styleUrls: ['./help-inline.component.scss'],
  imports: [
    CommonModule,
    SkyIdModule,
    SkyHelpInlineModule,
    SkyTrimModule,
    SkyPopoverModule,
    SkyI18nModule,
    SkyIconModule,
    SkyHelpInlineAriaExpandedPipe,
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
}
