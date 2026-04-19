import type { Chart } from 'chart.js';

import { CartesianNavigationStrategy } from './cartesian-navigation-strategy';
import { createNavigationStrategy } from './create-navigation-strategy';
import { RadialNavigationStrategy } from './radial-navigation-strategy';

describe('createNavigationStrategy', () => {
  it('should return a RadialNavigationStrategy for doughnut charts', () => {
    const chart = createMockChart('doughnut');

    const strategy = createNavigationStrategy(chart);

    expect(strategy).toBeInstanceOf(RadialNavigationStrategy);
  });

  it('should return a CartesianNavigationStrategy for bar charts', () => {
    const chart = createMockChart('bar');

    const strategy = createNavigationStrategy(chart);

    expect(strategy).toBeInstanceOf(CartesianNavigationStrategy);
  });

  it('should return a CartesianNavigationStrategy for line charts', () => {
    const chart = createMockChart('line');

    const strategy = createNavigationStrategy(chart);

    expect(strategy).toBeInstanceOf(CartesianNavigationStrategy);
  });
});

// #region Test Helpers
function createMockChart(type: string): Chart {
  return {
    config: { type },
  } as unknown as Chart;
}
// #endregion
