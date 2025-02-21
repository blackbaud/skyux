import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-docs-design-guideline-thumbnail',
  styles: `
    :host {
      display: block;
    }
  `,
  template: ``,
})
export class SkyDocsDesignGuidelineThumbnailComponent {}
// TODO: Do we need this?
