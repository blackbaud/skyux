import {
  ChangeDetectionStrategy,
  Component,
  Input,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SkyFluidGridGutterSizeType } from './types/fluid-grid-gutter-size-type';

/**
 * Wraps the fluid grid to ensure proper spacing. Without the wrapper, the
 * alignment, padding, and margins do not behave as expected.
 */
@Component({
  selector: 'sky-fluid-grid',
  templateUrl: './fluid-grid.component.html',
  styleUrls: ['./fluid-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyFluidGridComponent {
  #logSvc = inject(SkyLogService);

  /**
   * Disables the outer left and right margin of the fluid grid container.
   * @deprecated Use `inset` instead. Note that the values are inverted:
   * setting `disableMargin` to `true` is equivalent to setting `inset` to
   * `false`.
   */
  @Input()
  public set disableMargin(value: boolean | undefined) {
    this.#_disableMargin = value;

    if (value !== undefined) {
      this.#logSvc.deprecated('SkyFluidGridComponent.disableMargin', {
        deprecationMajorVersion: 15,
        replacementRecommendation:
          'Use the `inset` input instead. Note that the values are inverted: setting `disableMargin` to `true` is equivalent to setting `inset` to `false`.',
      });
    }
  }

  public get disableMargin(): boolean | undefined {
    return this.#_disableMargin;
  }

  /**
   * Whether to add padding inside the fluid grid container so its content is
   * inset from the container's outer left and right edges. When `false`,
   * the fluid grid's content extends to the edges of its container.
   * @default false
   */
  public readonly inset = input(false, { transform: booleanAttribute });

  /**
   * The type that defines the size of the padding
   * between columns.
   * @default "large"
   */
  @Input()
  public set gutterSize(value: SkyFluidGridGutterSizeType | undefined) {
    this.#_gutterSize = value ?? 'large';
  }

  public get gutterSize(): SkyFluidGridGutterSizeType {
    return this.#_gutterSize;
  }

  /**
   * Whether the fluid grid's outer left and right margin should be hidden.
   * The deprecated `disableMargin` input, when explicitly set, takes
   * precedence over `inset` to preserve existing behavior until it is
   * removed.
   */
  protected get noMargin(): boolean {
    return this.disableMargin ?? !this.inset();
  }

  #_disableMargin: boolean | undefined;
  #_gutterSize: SkyFluidGridGutterSizeType = 'large';
}
