import { expect } from '@skyux-sdk/testing';

import { SkyModalHostService } from './modal-host.service';

describe('Modal host service', () => {
  it('should return a modal z-index that is 1 greater than the backdrop z-index', () => {
    const service = new SkyModalHostService();

    expect(service.getModalZIndex()).toBe(
      SkyModalHostService.backdropZIndex + 1
    );
    service.destroy();
  });

  it('should increment the modal z-index values when a new instance is created', () => {
    const service1 = new SkyModalHostService();
    const service2 = new SkyModalHostService();

    expect(service2.getModalZIndex()).toBe(service1.getModalZIndex() + 10);

    service1.destroy();
    service2.destroy();
  });

  it('should decrement the backdrop z-index when an instance is destroyed', () => {
    const service1 = new SkyModalHostService();
    const service2 = new SkyModalHostService();

    const twoModalBackdropZIndex = SkyModalHostService.backdropZIndex;

    service2.destroy();

    expect(SkyModalHostService.backdropZIndex).toBe(
      twoModalBackdropZIndex - 10
    );

    service1.destroy();
  });

  it('should provide a count of open modals', () => {
    expect(SkyModalHostService.openModalCount).toBe(0);

    const service1 = new SkyModalHostService();
    const service2 = new SkyModalHostService();

    expect(SkyModalHostService.openModalCount).toBe(2);

    service2.destroy();

    expect(SkyModalHostService.openModalCount).toBe(1);

    service1.destroy();
  });

  it('should notify subscribers when a modal is closed', () => {
    const service = new SkyModalHostService();
    let closeEmitted = false;

    service.close.subscribe(() => {
      closeEmitted = true;
    });

    service.onClose();

    expect(closeEmitted).toBe(true);
    service.destroy();
  });

  it('should notify subscribers when the help header button is clicked', () => {
    const testHelpKey = 'test-key.html';
    let helpKey = '';
    let helpClicked = false;

    const service = new SkyModalHostService();

    service.openHelp.subscribe((key: string) => {
      helpClicked = true;
      helpKey = key;
    });

    service.onOpenHelp(testHelpKey);

    expect(helpClicked).toBe(true);
    expect(helpKey).toBe(testHelpKey);

    service.destroy();
  });
});
