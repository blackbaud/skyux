import {
  SkyFlyoutInstance
} from './index';

import {
  SkyFlyoutMessageType
 } from './types';

describe('Flyout instance', () => {
  it('should expose observables for closed event', () => {
    const flyout = new SkyFlyoutInstance();

    let closedCalled = false;

    flyout.closed.take(1).subscribe(() => {
      closedCalled = true;
    });

    flyout.closed.emit();
    expect(closedCalled).toEqual(true);
  });

  it('should expose method to close the flyout', () => {
    const flyout = new SkyFlyoutInstance();
    const spy = spyOn(flyout.hostController, 'next').and.callThrough();

    flyout.close();
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.Close
    });
  });

  it('should expose iterator next button methods to the flyout', () => {
    const flyout = new SkyFlyoutInstance();
    const spy = spyOn(flyout.hostController, 'next').and.callThrough();

    flyout.iteratorNextButtonDisabled = true;
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.DisableIteratorNextButton
    });

    flyout.iteratorNextButtonDisabled = false;
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.EnableIteratorNextButton
    });
  });

  it('should expose iterator previous button methods to the flyout', () => {
    const flyout = new SkyFlyoutInstance();
    const spy = spyOn(flyout.hostController, 'next').and.callThrough();

    flyout.iteratorPreviousButtonDisabled = true;
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.DisableIteratorPreviousButton
    });

    flyout.iteratorPreviousButtonDisabled = false;
    expect(spy).toHaveBeenCalledWith({
      type: SkyFlyoutMessageType.EnableIteratorPreviousButton
    });
  });

  it('should complete subscribes on destroy', () => {
    const flyout = new SkyFlyoutInstance();
    const previousSpy = spyOn(flyout.iteratorPreviousButtonClick, 'complete').and.callThrough();
    const nextSpy = spyOn(flyout.iteratorNextButtonClick, 'complete').and.callThrough();

    flyout.ngOnDestroy();
    expect(previousSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
  });
});
