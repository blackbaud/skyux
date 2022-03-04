// spell-checker:ignore hsva, hsla, cmyk, denormalize, colorpicker,Injectable
import { Injectable } from '@angular/core';

import { SkyColorpickerCmyk } from './types/colorpicker-cmyk';
import { SkyColorpickerHsla } from './types/colorpicker-hsla';
import { SkyColorpickerHsva } from './types/colorpicker-hsva';
import { SkyColorpickerOutput } from './types/colorpicker-output';
import { SkyColorpickerRgba } from './types/colorpicker-rgba';

/**
 * @internal
 */
@Injectable()
export class SkyColorpickerService {
  constructor() {}

  public hsla2hsva(hsla: SkyColorpickerHsla): SkyColorpickerHsva {
    const alpha: number = Math.min(hsla.alpha, 1);
    const hue: number = Math.min(hsla.hue, 1);
    const lightness: number = Math.min(hsla.lightness, 1);
    const saturation: number = Math.min(hsla.saturation, 1);
    const hsva: SkyColorpickerHsva = {
      hue: hue,
      saturation: saturation,
      value: lightness,
      alpha: alpha,
    };
    if (lightness === 0) {
      hsva.saturation = 0;
      hsva.value = 0;
    } else {
      hsva.value =
        lightness + (saturation * (1 - Math.abs(2 * lightness - 1))) / 2;
      hsva.saturation = (2 * (hsva.value - lightness)) / hsva.value;
    }
    return hsva;
  }

  public hsva2hsla(hsva: SkyColorpickerHsva): SkyColorpickerHsla {
    const alpha: number = hsva.alpha;
    const hue: number = hsva.hue;
    const saturation: number = hsva.saturation;
    const value: number = hsva.value;

    const hsla: SkyColorpickerHsla = {
      hue: hue,
      saturation: saturation,
      lightness: value,
      alpha: alpha,
    };
    if (value === 0) {
      hsla.lightness = 0;
      hsla.saturation = 0;
    } else {
      hsla.lightness = (value * (2 - saturation)) / 2;
      hsla.saturation =
        (value * saturation) / (1 - Math.abs(2 * hsla.lightness - 1));
    }
    return hsla;
  }

  public rgbaToHsva(rgba: SkyColorpickerRgba): SkyColorpickerHsva {
    const red: number = Math.min(rgba.red, 1);
    const green: number = Math.min(rgba.green, 1);
    const blue: number = Math.min(rgba.blue, 1);
    const alpha: number = Math.min(rgba.alpha, 1);
    const max: number = Math.max(red, green, blue);
    const min: number = Math.min(red, green, blue);
    const value: number = max;
    const d = max - min;
    const saturation: number = max === 0 ? 0 : d / max;
    let hue = 0;
    let maxValue: { [key: number]: number };
    if (max !== min) {
      maxValue = {
        [red]: (green - blue) / d + (green < blue ? 6 : 0),
        [green]: (blue - red) / d + 2,
        [blue]: (red - green) / d + 4,
      };
      hue = maxValue[max];
      hue /= 6;
    }
    const hsva: SkyColorpickerHsva = {
      hue: hue,
      saturation: saturation,
      value: value,
      alpha: alpha,
    };
    return hsva;
  }

  public rgbaToCmyk(rgba: SkyColorpickerRgba): SkyColorpickerCmyk {
    const cmyk: SkyColorpickerCmyk = { cyan: 0, magenta: 0, yellow: 0, key: 0 };
    const key: number = 1 - Math.max(rgba.red, rgba.green, rgba.blue);

    if (key === 1) {
      cmyk.key = 1;
      return cmyk;
    }
    cmyk.cyan = (1 - rgba.red - key) / (1 - key);
    cmyk.magenta = (1 - rgba.green - key) / (1 - key);
    cmyk.yellow = (1 - rgba.blue - key) / (1 - key);
    cmyk.key = key;
    return cmyk;
  }

  public hsvaToRgba(hsva: SkyColorpickerHsva): SkyColorpickerRgba {
    let red = 0;
    let green = 0;
    let blue = 0;
    const hue = hsva.hue;
    const saturation = hsva.saturation;
    const value = hsva.value;
    const alpha = hsva.alpha || hsva.alpha === 0 ? hsva.alpha : 1;
    const i = Math.floor(hue * 6);
    const f = hue * 6 - i;
    const p = value * (1 - saturation);
    const q = value * (1 - f * saturation);
    const t = value * (1 - (1 - f) * saturation);
    const color: { [key: number]: any } = {
      0: (): void => {
        red = value;
        green = t;
        blue = p;
      },
      1: (): void => {
        red = q;
        green = value;
        blue = p;
      },
      2: (): void => {
        red = p;
        green = value;
        blue = t;
      },
      3: (): void => {
        red = p;
        green = q;
        blue = value;
      },
      4: (): void => {
        red = t;
        green = p;
        blue = value;
      },
      5: (): void => {
        red = value;
        green = p;
        blue = q;
      },
    };
    color[i % 6]();

    const rgba: SkyColorpickerRgba = {
      red: red,
      green: green,
      blue: blue,
      alpha: alpha,
    };
    return rgba;
  }

  public stringToHsva(colorString: string, hex8: boolean): SkyColorpickerHsva {
    const stringParsers = [
      {
        // tslint:disable max-line-length
        re: /(rgb)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*%?,\s*(\d{1,3})\s*%?(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
        parse: (execResult: any) => {
          const rgba: SkyColorpickerRgba = {
            red: parseInt(execResult[2], 0) / 255,
            green: parseInt(execResult[3], 0) / 255,
            blue: parseInt(execResult[4], 0) / 255,
            alpha: parseFloat(execResult[5]),
          };
          return rgba;
        },
      },
      {
        re: /(hsl)a?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
        parse: (execResult: any) => {
          const hsla: SkyColorpickerHsla = {
            hue: parseInt(execResult[2], 0) / 360,
            saturation: parseInt(execResult[3], 0) / 100,
            lightness: parseInt(execResult[4], 0) / 100,
            alpha: parseFloat(execResult[5]),
          };
          return hsla;
          // tslint:enable max-line-length
        },
      },
    ];
    if (hex8) {
      stringParsers.push({
        re: /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/,
        parse: (execResult: any) => {
          const rgba: SkyColorpickerRgba = {
            red: parseInt(execResult[1], 16) / 255,
            green: parseInt(execResult[2], 16) / 255,
            blue: parseInt(execResult[3], 16) / 255,
            alpha: parseInt(execResult[4], 16) / 255,
          };
          return rgba;
        },
      });
    } else {
      stringParsers.push(
        {
          re: /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})$/,
          parse: (execResult: any) => {
            const rgba: SkyColorpickerRgba = {
              red: parseInt(execResult[1], 16) / 255,
              green: parseInt(execResult[2], 16) / 255,
              blue: parseInt(execResult[3], 16) / 255,
              alpha: 1,
            };
            return rgba;
          },
        },
        {
          re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])$/,
          parse: (execResult: any) => {
            const rgba: SkyColorpickerRgba = {
              red: parseInt(execResult[1] + execResult[1], 16) / 255,
              green: parseInt(execResult[2] + execResult[2], 16) / 255,
              blue: parseInt(execResult[3] + execResult[3], 16) / 255,
              alpha: 1,
            };
            return rgba;
          },
        }
      );
    }

    let hsva: SkyColorpickerHsva = undefined;
    for (const key in stringParsers) {
      /* istanbul ignore else */ /* for in must be filtered by an if */
      if (Object.prototype.hasOwnProperty.call(stringParsers, key)) {
        const parser = stringParsers[key];
        const match = parser.re.exec(colorString);
        const color: any = match && parser.parse(match);
        if (color) {
          if ('red' in color) {
            hsva = this.rgbaToHsva(color);
          }
          if ('hue' in color) {
            hsva = this.hsla2hsva(color);
          }

          return hsva;
        }
      }
    }
    return hsva;
  }

  public outputFormat(
    hsva: SkyColorpickerHsva,
    outputFormat: string,
    allowHex8: boolean
  ): string {
    if (['hsla', 'hex', 'cmyk'].indexOf(outputFormat) === -1) {
      outputFormat = 'rgba';
    }
    const color: { [key: string]: any } = {
      hsla: () => {
        const hsla = this.denormalizeHSLA(this.hsva2hsla(hsva));
        return `hsla(${hsla.hue},${hsla.saturation}%,${hsla.lightness}%,${hsla.alpha})`;
      },
      hex: () => {
        return this.hexText(
          this.denormalizeRGBA(this.hsvaToRgba(hsva)),
          allowHex8
        );
      },
      cmyk: () => {
        const cmyk = this.denormalizeCMYK(
          this.rgbaToCmyk(this.hsvaToRgba(hsva))
        );
        return `cmyk(${cmyk.cyan}%,${cmyk.magenta}%,${cmyk.yellow}%,${cmyk.key}%)`;
      },
      rgba: () => {
        const rgba = this.denormalizeRGBA(this.hsvaToRgba(hsva));
        return `rgba(${rgba.red},${rgba.green},${rgba.blue},${rgba.alpha})`;
      },
    };

    return color[outputFormat]();
  }

  public skyColorpickerOut(color: SkyColorpickerHsva) {
    let formatColor: SkyColorpickerOutput;
    const cmykText: string = this.outputFormat(color, 'cmyk', true);
    const hslaText: string = this.outputFormat(color, 'hsla', true);
    const rgbaText: string = this.outputFormat(color, 'rgba', true);
    const rgba: SkyColorpickerRgba = this.hsvaToRgba(color);
    const hsla: SkyColorpickerHsla = this.hsva2hsla(color);
    const cmyk: SkyColorpickerCmyk = this.rgbaToCmyk(rgba);
    const hex: string = this.outputFormat(color, 'hex', false);

    formatColor = {
      cmykText: cmykText,
      hslaText: hslaText,
      rgbaText: rgbaText,
      hsva: this.denormalizeHSVA(color),
      rgba: this.denormalizeRGBA(rgba),
      hsla: this.denormalizeHSLA(hsla),
      cmyk: this.denormalizeCMYK(cmyk),
      hex: hex,
    };
    return formatColor;
  }

  public hexText(rgba: SkyColorpickerRgba, allowHex8: boolean): string {
    // tslint:disable no-bitwise
    let hexText =
      '#' +
      ((1 << 24) | (rgba.red << 16) | (rgba.green << 8) | rgba.blue)
        .toString(16)
        .substr(1);
    if (
      hexText[1] === hexText[2] &&
      hexText[3] === hexText[4] &&
      hexText[5] === hexText[6] &&
      rgba.alpha === 1 &&
      !allowHex8
    ) {
      hexText = '#' + hexText[1] + hexText[3] + hexText[5];
    }
    if (allowHex8) {
      hexText += ((1 << 8) | Math.round(rgba.alpha * 255))
        .toString(16)
        .substr(1);
    }
    return hexText;
    // tslint:enable no-bitwise
  }

  public denormalizeRGBA(rgba: SkyColorpickerRgba): SkyColorpickerRgba {
    const denormalizeRgba: SkyColorpickerRgba = {
      red: Math.round(rgba.red * 255),
      green: Math.round(rgba.green * 255),
      blue: Math.round(rgba.blue * 255),
      alpha: Math.round(rgba.alpha * 100) / 100,
    };
    return denormalizeRgba;
  }

  public denormalizeHSLA(hsla: SkyColorpickerHsla): SkyColorpickerHsla {
    const denormalizeHsla: SkyColorpickerHsla = {
      hue: Math.round(hsla.hue * 360),
      saturation: Math.round(hsla.saturation * 100),
      lightness: Math.round(hsla.lightness * 100),
      alpha: Math.round(hsla.alpha * 100) / 100,
    };
    return denormalizeHsla;
  }

  public denormalizeHSVA(hsla: SkyColorpickerHsva): SkyColorpickerHsva {
    const denormalizeHsva: SkyColorpickerHsva = {
      hue: Math.round(hsla.hue * 360),
      saturation: Math.round(hsla.saturation * 100),
      value: Math.round(hsla.value * 100),
      alpha: Math.round(hsla.alpha * 100) / 100,
    };
    return denormalizeHsva;
  }

  public denormalizeCMYK(cmyk: SkyColorpickerCmyk): SkyColorpickerCmyk {
    const denormalizeCmyk: SkyColorpickerCmyk = {
      cyan: Math.round(cmyk.cyan * 100),
      magenta: Math.round(cmyk.magenta * 100),
      yellow: Math.round(cmyk.yellow * 100),
      key: Math.round(cmyk.key * 100),
    };
    return denormalizeCmyk;
  }
}
