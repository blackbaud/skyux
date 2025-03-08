import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

import { SkyDocsCategoryTagModule } from '../category-tag/category-tag.module';

/**
 * @internal
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sky-elevation-0-bordered sky-rounded-corners',
    '[class.sky-margin-stacked-xl]': 'stacked()',
  },
  imports: [SkyDocsCategoryTagModule],
  selector: 'sky-docs-type-definition-box',
  styles: `
    :host {
      display: block;
      overflow: hidden;
    }

    .sky-docs-type-definition-box-header {
      background-color: var(--sky-background-color-info-light);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sky-docs-type-definition-box-heading {
      margin: 0;
      font-weight: normal;
      word-break: break-all;
    }
  `,
  template: `
    <div
      class="sky-docs-type-definition-box-header sky-border-bottom-dark sky-padding-even-xl"
    >
      <h4 class="sky-docs-type-definition-box-heading">
        <code
          [class.sky-docs-text-strikethrough]="deprecated()"
          [innerHTML]="headingText()"
        ></code>
      </h4>
      @if (required()) {
        <sky-docs-category-tag color="red">Required</sky-docs-category-tag>
      }
    </div>
    <div class="sky-docs-type-definition-box-body sky-padding-even-xl">
      <ng-content />
    </div>
  `,
})
export class SkyDocsTypeDefinitionBoxComponent {
  public readonly headingText = input.required<string>();

  public readonly deprecated = input(false, { transform: booleanAttribute });
  public readonly required = input(false, { transform: booleanAttribute });
  public readonly stacked = input(false, { transform: booleanAttribute });
}
