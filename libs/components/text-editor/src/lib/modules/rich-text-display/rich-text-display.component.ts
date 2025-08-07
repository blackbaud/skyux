import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { SkyTextSanitizationService } from '../text-editor/services/text-sanitization.service';

@Component({
  selector: 'sky-rich-text-display',
  templateUrl: './rich-text-display.component.html',
  standalone: false,
})
export class SkyRichTextDisplayComponent {
  /**
   * The rich text to display.
   */
  @Input()
  public set richText(value: string | undefined) {
    if (value) {
      const cleaned = this.#sanitizationService.sanitize(value);
      /* istanbul ignore else */
      if (cleaned !== this.#_richText) {
        this.#_richText = cleaned;

        // Text has already been sanitized with DOMPurifier.
        // Tell Angular to bypass its own internal sanitization.
        this.sanitizedText = this.#sanitizer.bypassSecurityTrustHtml(cleaned);
      }
    } else {
      this.#_richText = '';
      this.sanitizedText = '';
    }
  }

  public sanitizedText: SafeHtml = '';

  #_richText = '';

  #sanitizer: DomSanitizer;
  #sanitizationService: SkyTextSanitizationService;

  constructor(
    sanitizer: DomSanitizer,
    sanitizationService: SkyTextSanitizationService,
  ) {
    this.#sanitizer = sanitizer;
    this.#sanitizationService = sanitizationService;
  }
}
