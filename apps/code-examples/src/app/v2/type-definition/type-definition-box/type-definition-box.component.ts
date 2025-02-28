import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';
import { SkyPillModule } from '@skyux/docs-tools';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // class: 'sky-elevation-0-bordered sky-rounded-corners sky-margin-stacked-lg',
    class: 'sky-margin-stacked-xl',
  },
  imports: [SkyPillModule],
  selector: 'sky-type-definition-box',
  styles: `
    :host {
      --sky-type-definition-box-border-color: color-mix(
        in srgb,
        var(--sky-background-color-info-light) 30%,
        var(--sky-border-color-neutral-medium-dark)
      );

      display: block;
      border: 1px solid var(--sky-type-definition-box-border-color);
      border-radius: var(--sky-border-radius-s);
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .sky-type-definition-box-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--sky-background-color-info-light);
      border-bottom: 1px solid var(--sky-type-definition-box-border-color);
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.065);
      padding: var(--sky-padding-even-xl);
    }

    .sky-type-definition-box-heading {
      margin: 0;
      font-weight: normal;
      line-height: 1.2;
      word-break: break-all;
    }

    .sky-text-strikethrough {
      text-decoration: line-through;
    }
  `,
  template: `
    <div class="sky-type-definition-box-header">
      <h4 class="sky-type-definition-box-heading">
        <code
          [class.sky-text-strikethrough]="deprecated()"
          [innerHTML]="headingText()"
        ></code>
      </h4>
    </div>
    <div class="sky-padding-even-xl">
      <ng-content />
    </div>
  `,
})
export class SkyTypeDefinitionBoxComponent {
  public deprecated = input(false, { transform: booleanAttribute });
  public headingText = input.required<string>();
  public required = input(false, { transform: booleanAttribute });
}
