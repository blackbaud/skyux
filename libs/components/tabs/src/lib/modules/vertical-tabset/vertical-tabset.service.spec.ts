import { MockSkyMediaQueryService } from '@skyux/core/testing';

import { SkyVerticalTabComponent } from './vertical-tab.component';
import { SkyVerticalTabsetService } from './vertical-tabset.service';

class MockChangeDetector {
  public detectChanges() {}
  public markForCheck() {}
}

describe('Vertical tabset service', () => {
  let service: SkyVerticalTabsetService;
  const mockDetectChanges: any = new MockChangeDetector();
  const mockQueryService = new MockSkyMediaQueryService();

  beforeEach(() => {
    service = new SkyVerticalTabsetService(mockQueryService as any);
  });

  it('should add two non active tabs', () => {
    const tab1 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );
    tab1.tabHeading = 'tab 1';

    const tab2 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );
    tab2.tabHeading = 'tab 2';

    service.tabClicked.subscribe((clicked) => {
      if (service.activeIndex >= 0) {
        fail(
          `tab should not have been clicked with index =${service.activeIndex}`
        );
      }
    });

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.tabs.length).toBe(2);
    expect(service.tabs[0].tabHeading).toBe('tab 1');
    expect(service.tabs[0].index).toBe(0);
    expect(service.tabs[1].tabHeading).toBe('tab 2');
    expect(service.tabs[1].index).toBe(1);
    expect(service.activeIndex).toBe(undefined);
  });

  it('should add active tab', () => {
    const tab1 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );
    const tab2 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );
    tab2.active = true;

    service.tabClicked.subscribe((clicked) => {
      if (service.activeIndex >= 0) {
        expect(service.activeIndex).toBe(1);
      }
    });

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.activeIndex).toBe(1);
  });

  it('should deactive old active tab', () => {
    const tab1 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );
    tab1.active = true;
    const tab2 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.activeIndex).toBe(0);

    tab2.active = true;
    service.activateTab(tab2);

    expect(tab1.active).toBe(false);
    expect(tab2.active).toBe(true);
    expect(service.activeIndex).toBe(1);
  });

  it('content should return undefined when no active tabs', () => {
    const tab1 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );
    const tab2 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.activeTab()).toBe(undefined);
  });

  it('destroy tab removes it from the service', () => {
    const tab1 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );
    tab1.tabHeading = 'tab 1';

    const tab2 = new SkyVerticalTabComponent(
      undefined,
      mockDetectChanges,
      undefined,
      undefined
    );
    tab2.tabHeading = 'tab 2';

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.tabs.length).toBe(2);

    // attempt to destroy tab not existing in service
    service.destroyTab(
      new SkyVerticalTabComponent(
        undefined,
        mockDetectChanges,
        undefined,
        undefined
      )
    );
    expect(service.tabs.length).toBe(2);

    service.destroyTab(tab1);
    expect(service.tabs.length).toBe(1);
    expect(service.tabs[0]).toBe(tab2);
  });
});
