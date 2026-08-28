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
 * Coerces `inset` the same way `booleanAttribute` does, except `null`/
 * `undefined` are preserved instead of collapsed to `false`. This keeps
 * "not set" distinguishable from "explicitly set to false" -- even when the
 * input is bound to an expression that currently evaluates to `undefined`
 * -- so `inset` can take precedence over the deprecated `disableMargin`
 * input only when it's actually been set.
 */
function insetTransform(value: unknown): boolean | undefined {
  return value === undefined || value === null
    ? undefined
    : booleanAttribute(value);
}

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
  public readonly inset = input<boolean | undefined>(undefined, {
    transform: insetTransform,
  });

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
   * `inset`, when explicitly set, takes precedence over the deprecated
   * `disableMargin` input. If only `disableMargin` is set, it's honored so
   * existing behavior is preserved until it's removed.
   */
  protected get noMargin(): boolean {
    const inset = this.inset();

    return inset === undefined ? (this.disableMargin ?? true) : !inset;
  }

  #_disableMargin: boolean | undefined;
  #_gutterSize: SkyFluidGridGutterSizeType = 'large';
}
