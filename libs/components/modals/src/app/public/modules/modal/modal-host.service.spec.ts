import {
  expect
} from '@skyux-sdk/testing';

import { SkyModalHostService } from './modal-host.service';

describe('Modal host service', () => {
  it('should return a modal z-index that is 1 greater than the backdrop z-index', () => {
    let service = new SkyModalHostService(false);

    expect(service.getModalZIndex()).toBe(SkyModalHostService.backdropZIndex + 1);
    service.destroy();
  });

  it('should increment the modal z-index values when a new instance is created', () => {
    let service1 = new SkyModalHostService(false);
    let service2 = new SkyModalHostService(false);

    expect(service2.getModalZIndex()).toBe(service1.getModalZIndex() + 10);

    service1.destroy();
    service2.destroy();
  });

  it('should decrement the backdrop z-index when an instance is destroyed', () => {
    let service1 = new SkyModalHostService(false);
    let service2 = new SkyModalHostService(false);

    let twoModalBackdropZIndex = SkyModalHostService.backdropZIndex;

    service2.destroy();

    expect(SkyModalHostService.backdropZIndex).toBe(twoModalBackdropZIndex - 10);

    service1.destroy();
  });

  it('should provide a count of open modals', () => {
    expect(SkyModalHostService.openModalCount).toBe(0);

    let service1 = new SkyModalHostService(false);
    let service2 = new SkyModalHostService(false);

    expect(SkyModalHostService.openModalCount).toBe(2);

    service2.destroy();

    expect(SkyModalHostService.openModalCount).toBe(1);

    service1.destroy();
  });

  it('should notify subscribers when a modal is closed', () => {
    let service = new SkyModalHostService(false);
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

    let service = new SkyModalHostService(false);

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
