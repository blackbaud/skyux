function getDataPoint(
  category: string,
  series: string,
): Cypress.Chainable<JQuery<HTMLElement>> {
  return cy.get(
    `#actual-vs-target-chart .sky-chart-data-point[data-sky-chart-category="${category}"][data-sky-chart-series="${series}"]`,
  );
}

// Data point interaction states are drawn on the canvas, so they are driven
// with synthetic events rather than story args. This dispatches an event at
// the center of a data point; the focusable stand-ins share the canvas's
// coordinate space and ignore pointer events.
function triggerOnDataPoint(
  eventName: 'mousemove' | 'pointerdown',
  category: string,
  series: string,
): void {
  getDataPoint(category, series).then(([dataPoint]) => {
    const { left, top, width, height } = dataPoint.style;

    cy.get('#actual-vs-target-chart canvas').trigger(
      eventName,
      parseFloat(left) + parseFloat(width) / 2,
      parseFloat(top) + parseFloat(height) / 2,
    );
  });

  // Chart.js handles pointer events on the next animation frame, so wait for
  // it to register the event before continuing.
  cy.window().then(
    (win) =>
      new Cypress.Promise<void>((resolve) =>
        win.requestAnimationFrame(() => resolve()),
      ),
  );
}

/**
 * Captures the hover, pressed, and focus states of a data point in the
 * `#actual-vs-target-chart` chart of the story visited by `beforeEach`.
 */
export function itRendersDataPointStates(
  screenshotPrefix: string,
  theme: string,
  category: string,
  series: string,
): void {
  function capture(state: string): void {
    cy.get('#actual-vs-target-chart').skyVisualTest(
      `${screenshotPrefix}-data-point-${state}-${theme}`,
      { overwrite: true, disableTimersAndAnimations: true },
    );
  }

  it('should render a hovered data point', () => {
    triggerOnDataPoint('mousemove', category, series);
    capture('hover');
  });

  it('should render a pressed data point', () => {
    triggerOnDataPoint('mousemove', category, series);
    triggerOnDataPoint('pointerdown', category, series);
    capture('active');
  });

  it('should render a focused data point', () => {
    getDataPoint(category, series).focus();
    capture('focus');
  });
}
