/**
 * Forked from https://www.chartjs.org/docs/latest/samples/utils.html
 */
export class ChartDemoUtils {
  // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  static #seed = Date.now();

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
  }): (number | null)[] {
    const cfg = config || {};
    const min = cfg.min ?? 0;
    const max = cfg.max ?? 100;
    const from = cfg.from ?? [];
    const count = cfg.count ?? 8;
    const decimals = cfg.decimals ?? 8;
    const continuity = cfg.continuity ?? 1;
    const dfactor = Math.pow(10, decimals) || 0;

    const data: (number | null)[] = [];
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

  public static months(config: { count?: number; section?: number }): string[] {
    const cfg = config ?? {};
    const count = cfg.count ?? 12;
    const section = cfg.section;
    const values: string[] = [];
    let value: string;

    for (let i = 0; i < count; ++i) {
      value = this.#Months[Math.ceil(i) % 12];
      values.push(value.substring(0, section));
    }

    return values;
  }

  /**
   * Creates an array of random series data.
   * @param config Configuration options.
   * @returns An array of randomly generated series data.
   */
  public static createRandomSeries(config: {
    seriesCount?: number;
    labels?: string[];
    dataCount?: number;
    categories?: string[];
    min?: number;
    max?: number;
  }): DemoSeries[] {
    const { labels, dataCount, categories, min, max } = config;
    const seriesCount = labels?.length ?? config.seriesCount ?? 1;

    return Array.from({ length: seriesCount }, (_, seriesIndex) =>
      this.createRandomSeriesData({
        seriesIndex,
        labelText: labels?.[seriesIndex],
        count: dataCount,
        categories,
        min,
        max,
      }),
    );
  }

  /**
   * Creates a single series of random data.
   * @param config Configuration options.
   * @returns An object representing a series of randomly generated data points.
   */
  public static createRandomSeriesData(config: {
    seriesIndex: number;
    labelText?: string;
    count?: number;
    categories?: string[];
    min?: number;
    max?: number;
  }): DemoSeries {
    const { seriesIndex, labelText, count, categories, min, max } = config;
    const data = this.createRandomData({
      count: count ?? categories?.length ?? 8,
      categories,
      min,
      max,
    });

    return {
      labelText: labelText ?? `Series ${seriesIndex + 1}`,
      data: data,
    };
  }

  /**
   * Creates an array of random donut chart slices.
   * @param config Configuration options.
   * @returns An array of randomly generated slice data.
   */
  public static createRandomData(config: {
    count?: number;
    categories?: string[];
    min?: number;
    max?: number;
  }): DemoSeriesData[] {
    const { count, categories, min, max } = config;
    const resolvedCount = count ?? categories?.length ?? 8;

    return ChartDemoUtils.numbers({
      min: min ?? 1,
      max: max ?? 100,
      count: resolvedCount,
      decimals: 0,
    }).map((value, index) => ({
      category: categories?.[index] ?? `Category ${index + 1}`,
      value: value,
      label: `$${value.toLocaleString()}`,
    }));
  }
}

export interface DemoSeries {
  labelText: string;
  data: DemoSeriesData[];
}

export interface DemoSeriesData {
  category: string;
  label: string;
  value: number;
}
