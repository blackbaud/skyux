import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'sky-docs-safe-html',
  templateUrl: './safe-html.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDocsSafeHtmlComponent {
  @Input()
  public innerHtml: string;

  constructor(private domSanitizer: DomSanitizer) {}

  public getTrustedHtml(content: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(content);
  }
}
