/**
 * Forked from https://www.chartjs.org/docs/latest/samples/utils.html
 */
export class ChartDemoUtils {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  static #seed = 6; //Date.now();

  static #Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ] as const;

  public static random(min?: number, max?: number): number {
    min = min ?? 0;
    max = max ?? 0;
    this.#seed = (this.#seed * 9301 + 49297) % 233280;
    return min + (this.#seed / 233280) * (max - min);
  }

  // eslint-disable-next-line complexity -- test utility
  public static numbers(config: {
    min?: number;
    max?: number;
    from?: number[];
    count?: number;
    decimals?: number;
    continuity?: number;
  }): number[] {
    const cfg = config || {};
    const min = cfg.min ?? 0;
    const max = cfg.max ?? 100;
    const from = cfg.from ?? [];
    const count = cfg.count ?? 8;
    const decimals = cfg.decimals ?? 8;
    const continuity = cfg.continuity ?? 1;
    const dfactor = Math.pow(10, decimals) || 0;
    const data = [];

    let value: number;

    for (let i = 0; i < count; ++i) {
      value = (from[i] || 0) + this.random(min, max);
      if (this.random() <= continuity) {
        data.push(Math.round(dfactor * value) / dfactor);
      } else {
        data.push(null);
      }
    }

    return data;
  }

  public static points(config: {
    min?: number;
    max?: number;
    from?: number[];
    count?: number;
    decimals?: number;
    continuity?: number;
  }): { x: number; y: number }[] {
    const xs = this.numbers(config);
    const ys = this.numbers(config);
    return xs.map((x, i) => ({ x, y: ys[i] }));
  }

  public static labels(config: {
    min?: number;
    max?: number;
    count?: number;
    decimals?: number;
    prefix?: string;
  }): string[] {
    const cfg = config || {};
    const min = cfg.min || 0;
    const max = cfg.max || 100;
    const count = cfg.count || 8;
    const step = (max - min) / count;
    const decimals = cfg.decimals || 8;
    const dfactor = Math.pow(10, decimals) || 0;
    const prefix = cfg.prefix || '';
    const values = [];

    for (let i = min; i < max; i += step) {
      values.push(prefix + Math.round(dfactor * i) / dfactor);
    }

    return values;
  }

  public static months(config: { count?: number; section?: number }): string[] {
    const cfg = config || {};
    const count = cfg.count || 12;
    const section = cfg.section;
    const values = [];
    let value: string;

    for (let i = 0; i < count; ++i) {
      value = this.#Months[Math.ceil(i) % 12];
      values.push(value.substring(0, section));
    }

    return values;
  }
}
