import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-docs-design-guideline',
  styles: `
    :host {
      display: block;
    }
  `,
  template: `
    @if (heading(); as heading) {
      <h3>
        {{ heading }}
      </h3>
    }
  `,
})
export class SkyDocsDesignGuidelineComponent {
  public heading = input<string | undefined>();
}
