import { take } from 'rxjs/operators';

import { SkyFlyoutInstance } from './flyout-instance';
import { SkyFlyoutMessageType } from './types/flyout-message-type';

describe('Flyout instance', () => {
  function createFlyout(): SkyFlyoutInstance<object> {
    return new SkyFlyoutInstance({});
  }

  it('should warn when created without a component instance', () => {
    const warnSpy = spyOn(console, 'warn');

    // This preserves coverage for the temporary backwards-compatible path.
    const flyout = new SkyFlyoutInstance(undefined);

    expect(flyout.componentInstance).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      jasmine.stringContaining(
        "The SkyFlyoutInstance was created without a reference to the flyout's child component instance",
      ),
    );
  });

  it('should expose observables for closed event', () => {
    const flyout = createFlyout();

    let closedCalled = false;

    flyout.closed.pipe(take(1)).subscribe(() => {
      closedCalled = true;
    });

    flyout.closed.emit();
    expect(closedCalled).toEqual(true);
  });

  it('should expose method to close the flyout', () => {
    const flyout = createFlyout();
    const spy = spyOn(flyout.hostController, 'next').and.callThrough();

    flyout.close();
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.Close,
      data: {
        ignoreBeforeClose: false,
      },
    });
  });

  it('should expose iterator next button methods to the flyout', () => {
    const flyout = createFlyout();
    const spy = spyOn(flyout.hostController, 'next').and.callThrough();

    flyout.iteratorNextButtonDisabled = true;
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.DisableIteratorNextButton,
    });

    flyout.iteratorNextButtonDisabled = false;
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.EnableIteratorNextButton,
    });
  });

  it('should expose iterator previous button methods to the flyout', () => {
    const flyout = createFlyout();
    const spy = spyOn(flyout.hostController, 'next').and.callThrough();

    flyout.iteratorPreviousButtonDisabled = true;
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.DisableIteratorPreviousButton,
    });

    flyout.iteratorPreviousButtonDisabled = false;
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.EnableIteratorPreviousButton,
    });
  });

  it('should complete iterator emitters when the flyout closes', () => {
    const flyout = createFlyout();
    const previousSpy = spyOn(
      flyout.iteratorPreviousButtonClick,
      'complete',
    ).and.callThrough();
    const nextSpy = spyOn(
      flyout.iteratorNextButtonClick,
      'complete',
    ).and.callThrough();

    flyout.close();
    expect(previousSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
  });
});
