import { SkyVerticalTabsetService } from './vertical-tabset.service';
import { SkyVerticalTabComponent } from './vertical-tab.component';
import { MockSkyMediaQueryService } from '@skyux/core/testing/mock-media-query.service';

class MockChangeDetector {
  public detectChanges() {}
  public markForCheck() {}
}

describe('Vertical tabset service', () => {
  let service: SkyVerticalTabsetService;
  let mockDetectChanges: any = new MockChangeDetector();
  let mockQueryService = new MockSkyMediaQueryService();

  beforeEach(() => {
    service = new SkyVerticalTabsetService(mockQueryService);
  });

  it('should add two non active tabs', () => {
    let tab1 = new SkyVerticalTabComponent(undefined, mockDetectChanges);
    tab1.tabHeading = 'tab 1';

    let tab2 = new SkyVerticalTabComponent(undefined, mockDetectChanges);
    tab2.tabHeading = 'tab 2';

    service.tabClicked.subscribe(clicked => {
      if (service.activeIndex >= 0) {
        fail(`tab should not have been clicked with index =${service.activeIndex}`);
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
    let tab1 = new SkyVerticalTabComponent(undefined, mockDetectChanges);
    let tab2 = new SkyVerticalTabComponent(undefined, mockDetectChanges);
    tab2.active = true;

    service.tabClicked.subscribe(clicked => {
      if (service.activeIndex >= 0) {
        expect(service.activeIndex).toBe(1);
      }
    });

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.activeIndex).toBe(1);
  });

  it('should deactive old active tab', () => {
    let tab1 = new SkyVerticalTabComponent(undefined, mockDetectChanges);
    tab1.active = true;
    let tab2 = new SkyVerticalTabComponent(undefined, mockDetectChanges);

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
    let tab1 = new SkyVerticalTabComponent(undefined, mockDetectChanges);
    let tab2 = new SkyVerticalTabComponent(undefined, mockDetectChanges);

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.activeTabContent()).toBe(undefined);
  });
});
