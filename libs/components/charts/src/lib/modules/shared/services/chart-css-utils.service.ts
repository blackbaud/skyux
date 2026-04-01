import { DOCUMENT, Injectable, inject } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

/**
 * Utility service for CSS calculations and property resolution.
 * @remarks Chart.js requires pixel values
 */
@Injectable({ providedIn: 'root' })
export class SkyChartCssUtilsService {
  readonly #skyAppWindowRef = inject(SkyAppWindowRef);
  readonly #document = inject(DOCUMENT);

  /**
   * A hidden element used for measuring CSS values that require rendering (e.g. calc(), rem, ect values).
   * This element is reused for measurements to avoid unnecessary DOM bloat.
   */
  readonly #measureElement: HTMLDivElement;

  constructor() {
    this.#measureElement = this.#document.createElement('div');
    this.#measureElement.style.position = 'absolute';
    this.#measureElement.style.visibility = 'hidden';
    this.#measureElement.style.pointerEvents = 'none';
  }

  /**
   * Resolve a CSS custom property value with an optional fallback
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/var
   * @param varName The CSS variable name to resolve
   * @param cssFallback The fallback value to use if the CSS variable is not found. This should ideally be in the same format as the expected CSS value (e.g. "16px" for width/height values).
   * @returns The resolved CSS variable value, or the fallback if not found. Returns empty string if neither is found.
   */
  public css(varName: `--${string}`, cssFallback?: string): string {
    // Try to get from body first (where theme classes are typically applied)
    let value = this.#skyAppWindowRef.nativeWindow
      .getComputedStyle(this.#document.body)
      .getPropertyValue(varName)
      .trim();

    // Fallback to document element
    if (!value) {
      value = this.#skyAppWindowRef.nativeWindow
        .getComputedStyle(this.#document.documentElement)
        .getPropertyValue(varName)
        .trim();
    }

    // Final fallback to provided fallback value or empty string
    value = value || cssFallback || '';

    return value;
  }

  /**
   * Resolves a CSS property that is expected to be a numeric value (e.g. border width, font weight) and returns it as a number.
   * @remarks This method will parse the numeric portion of the value, so it can handle values like "1px" or "400". If the value cannot be parsed as a number, it will return NaN.
   * @param varName The CSS variable name to resolve
   * @param cssFallback The fallback value to use if the CSS variable is not found. This should ideally be in the same format as the expected CSS value (e.g. "16px" for width/height values).
   * @param cssProperty The CSS property to apply the value to for measurement (default is 'font-size'). This is only needed if the CSS value uses units (e.g. "1px") and needs to be measured to resolve to a pixel value.
   * @returns The numeric value of the CSS property, or NaN if it cannot be parsed as a number
   */
  public cssNumber(
    varName: `--${string}`,
    cssFallback?: string,
    cssProperty = 'width',
  ): number {
    const value = this.css(varName, cssFallback);
    const parsed = Number.parseFloat(value);

    // Unit-less or pixel-based numbers can be returned immediately
    if (String(parsed) === value || value.endsWith('px')) {
      return parsed;
    }

    // For other units (e.g. rem, em, etc), we need to measure the computed pixel value
    const measured = this.cssMeasured(varName, cssFallback, cssProperty);
    return Number.parseFloat(measured);
  }

  /**
   * Resolves a CSS property that may involve calculations (e.g. using calc(), rem, ect) and returns the computed value as a string (e.g. "16px").
   * @remarks This method creates a temporary element, applies the CSS value to the requested property, and then reads the computed value.
   * @param varName The CSS variable name to resolve
   * @param cssFallback The fallback value to use if the CSS variable is not found. This should ideally be in the same format as the expected CSS value (e.g. "16px" for width/height values).
   * @param cssProperty The CSS property to apply the value to for measurement (default is 'width')
   * @returns The measured value as a string (e.g. "16px")
   */
  public cssMeasured(
    varName: `--${string}`,
    cssFallback?: string,
    cssProperty = 'width',
  ): string {
    const cssValue = this.css(varName, cssFallback);

    const el = this.#measureElement;
    el.style.setProperty(cssProperty, cssValue);
    this.#document.body.appendChild(el);

    try {
      return this.#skyAppWindowRef.nativeWindow
        .getComputedStyle(el)
        .getPropertyValue(cssProperty)
        .trim();
    } finally {
      el.style.removeProperty(cssProperty);
      el.remove();
    }
  }

  /**
   * Extracts the color value from a CSS shadow property.
   * @param shadowValue The shadow CSS value
   * @returns The extracted color (rgb/rgba or hex), or null if not found
   */
  public extractShadowColor(shadowValue: string): string | null {
    const rgbaMatch = shadowValue.match(
      /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)/,
    );
    if (rgbaMatch) {
      return rgbaMatch[0];
    }

    const hexMatch = shadowValue.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})/);
    if (hexMatch) {
      return hexMatch[0];
    }

    return null;
  }

  /**
   * Converts a color value to rgba format with the specified alpha value.
   * @param color The color value (rgb, rgba, or hex)
   * @param alpha The alpha value to apply (0-1)
   * @returns The rgba color string, or null if color format is not recognized
   */
  public colorToRgbaWithAlpha(color: string, alpha: number): string | null {
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
    }

    const hexMatch = color.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) {
      const hex =
        hexMatch[1].length === 3
          ? hexMatch[1]
              .split('')
              .map((char) => char + char)
              .join('')
          : hexMatch[1];
      const r = Number.parseInt(hex.slice(0, 2), 16);
      const g = Number.parseInt(hex.slice(2, 4), 16);
      const b = Number.parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return null;
  }
}
