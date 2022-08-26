import { take } from 'rxjs/operators';

import { SkyModalCloseArgs } from './modal-close-args';
import { SkyModalInstance } from './modal-instance';

describe('Modal instance', () => {
  it('should not error if no close callback is specified', () => {
    const instance = new SkyModalInstance();

    instance.close();
  });

  it('should allow users to subscribe to the instanceClose event', function () {
    let instance: SkyModalInstance;
    // This result will be overwritten in the subscription below
    let result: SkyModalCloseArgs = { reason: undefined, data: undefined };

    instance = subscribeToClosed();
    instance.cancel('My result');

    expect(result.data).toBe('My result');
    expect(result.reason).toBe('cancel');

    instance = subscribeToClosed();
    instance.save('My data');
    expect(result.data).toBe('My data');
    expect(result.reason).toBe('save');

    instance = subscribeToClosed();
    instance.close('My close', 'reason');
    expect(result.data).toBe('My close');
    expect(result.reason).toBe('reason');

    instance = subscribeToClosed();
    instance.close('close data');
    expect(result.data).toBe('close data');
    expect(result.reason).toBe('close');

    function subscribeToClosed() {
      const modalInstance = new SkyModalInstance();

      modalInstance.closed.subscribe((instanceResult: SkyModalCloseArgs) => {
        result = instanceResult;
      });

      return modalInstance;
    }
  });

  it('should only emit closed and complete', () => {
    const instance = new SkyModalInstance();
    let wasClosedEmitted = false;
    let wasClosedCompleted = false;

    instance.closed.subscribe({
      next: () => (wasClosedEmitted = true),
      complete: () => (wasClosedCompleted = true),
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
