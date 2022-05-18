import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';

import { SkyFormatItem } from './format-item';

const tokenRegex = /(\{\d+\})/;

@Component({
  selector: 'sky-format',
  templateUrl: './format.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyFormatComponent {
  public itemsForDisplay: SkyFormatItem[];

  /**
   * The tokenized string that represents the template. Tokens use the `{n}` notation
   * where `n` is the ordinal of the item to replace the token.
   */
  @Input()
  public set text(value: string) {
    this._text = value;
    this.updateItemsForDisplay();
  }

  public get text(): string {
    return this._text;
  }

  /**
   * An array of `TemplateRef` objects to be placed in the template, where the `nth`
   * item is placed at the `{n}` location in the template.
   */
  @Input()
  public set args(value: TemplateRef<unknown>[]) {
    this._args = value;
    this.updateItemsForDisplay();
  }

  public get args(): TemplateRef<unknown>[] {
    return this._args;
  }

  private _text: string;

  private _args: TemplateRef<unknown>[];

  private updateItemsForDisplay(): void {
    this.itemsForDisplay = [];

    if (this.text && this.args) {
      const textParts = this.text.split(tokenRegex);

      for (const textPart of textParts) {
        // Disregard empty strings.
        if (textPart) {
          const item: SkyFormatItem = {};

          if (tokenRegex.test(textPart)) {
            const valueIndex = +textPart.substring(1, textPart.length - 1);

            item.templateRef = this.args[valueIndex];
          } else {
            item.text = textPart;
          }

          this.itemsForDisplay.push(item);
        }
      }
    }
  }
}
