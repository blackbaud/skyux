import {
  type DateAdapter,
  Scale,
  TimeScale,
  type TimeScaleOptions,
} from 'chart.js';
import { mergeIf } from 'chart.js/helpers';

import {
  SkyChartDateAdapter,
  type SkyChartDateAdapterOptions,
} from './chart-js-date-adapter';

// Fields TimeScale.init() sets that Chart.js's types don't declare.
interface TimeScaleInternals {
  _adapter: DateAdapter;
  _parseOpts: { parser: unknown; round: unknown; isoWeekday: unknown };
}

/**
 * The scale type of `SkyChartTimeScale`. Chart.js's types list only its own
 * scale types, so it is typed as the built-in time scale it extends.
 * @internal
 */
export const SKY_CHART_TIME_SCALE_TYPE = 'skyTime' as 'time';

/**
 * A Chart.js time scale that uses the SKY UX date adapter. Chart.js's own time
 * scale uses the date adapter registered globally, which belongs to the
 * consumer when they use Chart.js directly.
 * @internal
 */
export class SkyChartTimeScale extends TimeScale {
  public static override id = SKY_CHART_TIME_SCALE_TYPE;

  // Mirrors TimeScale.init(), which creates the global date adapter instead.
  // SKY UX charts never set Chart.js's `normalized` option, so it is skipped.
  public override init(options: TimeScaleOptions): void {
    const scale = this as unknown as TimeScaleInternals;
    const { time } = options;
    const adapter = new SkyChartDateAdapter(
      options.adapters.date as SkyChartDateAdapterOptions,
    );

    scale._adapter = adapter;
    adapter.init();
    mergeIf(time.displayFormats, adapter.formats());

    scale._parseOpts = {
      parser: time.parser,
      round: time.round,
      isoWeekday: time.isoWeekday,
    };

    Scale.prototype.init.call(this, options);
  }
}
