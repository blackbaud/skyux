import {
  take
} from 'rxjs/operators';

import {
  SkyModalInstance
} from './modal-instance';

import {
  SkyModalCloseArgs
} from './modal-close-args';

describe('Modal instance', () => {
  it('should not error if no close callback is specified', () => {
    let instance = new SkyModalInstance();

    instance.close();
  });

  it('should allow users to subscribe to the instanceClose event', function () {
    let instance: SkyModalInstance;
    let expectedResult: SkyModalCloseArgs;

    instance = subscribeToClosed();
    instance.cancel('My result');

    expect(expectedResult.data).toBe('My result');
    expect(expectedResult.reason).toBe('cancel');

    instance = subscribeToClosed();
    instance.save('My data');
    expect(expectedResult.data).toBe('My data');
    expect(expectedResult.reason).toBe('save');

    instance = subscribeToClosed();
    instance.close('My close', 'reason');
    expect(expectedResult.data).toBe('My close');
    expect(expectedResult.reason).toBe('reason');

    instance = subscribeToClosed();
    instance.close('close data');
    expect(expectedResult.data).toBe('close data');
    expect(expectedResult.reason).toBe('close');

    function subscribeToClosed() {
      const modalInstance = new SkyModalInstance();

      modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
        expectedResult = result;
      });

      return modalInstance;
    }
  });

  it('should only emit closed and complete', () => {
    const instance = new SkyModalInstance();
    let wasClosedEmitted = false;
    let wasClosedCompleted = false;

    instance.closed.subscribe({
      next: () => wasClosedEmitted = true,
      complete: () => wasClosedCompleted = true
    });

    instance.close();
    expect(wasClosedEmitted).toBe(true);
    expect(wasClosedCompleted).toBe(true);
  });

  it('should allow users to subscribe to helpOpened event', () => {
    const modalInstance = new SkyModalInstance();

    let helpOpened = false;

    modalInstance.helpOpened.pipe(take(1)).subscribe(() => {
      helpOpened = true;
    });

    modalInstance.openHelp();

    expect(helpOpened).toEqual(true);
  });
});
