import { SkyPopoverContentHarness } from './popover-content-harness';

/**
 * Dispatches a `transitionend` event on the popover container to simulate
 * CSS animation completion. Call this after programmatically opening or
 * closing a popover (e.g. via `SkyPopoverMessageType`) to ensure that the
 * `popoverOpened` and `popoverClosed` output events are emitted.
 */
export async function triggerTransitionEnd(
  content: SkyPopoverContentHarness | null,
): Promise<void> {
  const container = await content?.querySelector('.sky-popover-container');
  await container?.dispatchEvent('transitionend', {
    propertyName: 'opacity',
  });
}
