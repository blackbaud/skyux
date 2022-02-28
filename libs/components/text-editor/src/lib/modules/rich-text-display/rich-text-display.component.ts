import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SkyTextSanitizationService } from '../text-editor/services/text-sanitization.service';

@Component({
  selector: 'sky-rich-text-display',
  templateUrl: './rich-text-display.component.html',
})
export class SkyRichTextDisplayComponent {
  /**
   * Specifies the rich text to display.
   */
  @Input()
  public set richText(value: string) {
    const cleaned = this.sanitizationService.sanitize(value);
    /* istanbul ignore else */
    if (cleaned !== this._richText) {
      this._richText = cleaned;

      // Text has already been sanitized with DOMPurifier.
      // Tell Angular to bypass its own internal sanitization.
      this.sanitizedText = this.sanitizer.bypassSecurityTrustHtml(cleaned);
    }
  }

  public sanitizedText: SafeHtml = '';

  private _richText: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private sanitizationService: SkyTextSanitizationService
  ) {}
}
