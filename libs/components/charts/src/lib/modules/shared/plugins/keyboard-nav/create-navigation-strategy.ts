import type { Chart } from 'chart.js';

import { isDonutChart } from '../../chart-helpers';

import { CartesianNavigationStrategy } from './cartesian-navigation-strategy';
import type { NavigationStrategy } from './navigation-strategy';
import { RadialNavigationStrategy } from './radial-navigation-strategy';

/**
 * Factory function to create the appropriate navigation strategy based on the chart type.
 * @param chart
 * @returns An instance of NavigationStrategy tailored to the chart's layout (cartesian vs. radial).
 */
export function createNavigationStrategy(chart: Chart): NavigationStrategy {
  if (isDonutChart(chart)) {
    return new RadialNavigationStrategy(chart);
  }

  return new CartesianNavigationStrategy(chart);
}
