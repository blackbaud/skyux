import { TestBed } from '@angular/core/testing';
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';

import { SkyVerticalTabsetAdapterService } from './vertical-tabset-adapter.service';
import { SkyVerticalTabsetService } from './vertical-tabset.service';

describe('Vertical tabset service', () => {
  let service: SkyVerticalTabsetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SkyVerticalTabsetService,
        SkyVerticalTabsetAdapterService,
        provideSkyMediaQueryTesting(),
      ],
    });

    service = TestBed.inject(SkyVerticalTabsetService);
  });

  it('should add two non active tabs', () => {
    const tab1 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);
    tab1.tabHeading = 'tab 1';

    const tab2 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);
    tab2.tabHeading = 'tab 2';

    service.tabClicked.subscribe(() => {
      if (service.activeIndex && service.activeIndex >= 0) {
        fail(
          `tab should not have been clicked with index =${service.activeIndex}`,
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
    const tab1 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);
    const tab2 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);
    tab2.active = true;

    service.tabClicked.subscribe(() => {
      if (service.activeIndex && service.activeIndex >= 0) {
        expect(service.activeIndex).toBe(1);
      }
    });

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.activeIndex).toBe(1);
  });

  it('should deactivate old active tab', () => {
    const tab1 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);
    tab1.active = true;
    const tab2 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);

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
    const tab1 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);
    const tab2 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.activeTab()).toBe(undefined);
  });

  it('destroy tab removes it from the service', () => {
    const tab1 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);
    tab1.tabHeading = 'tab 1';

    const tab2 = jasmine.createSpyObj('SkyVerticalTabComponent', [
      'tabDeactivated',
    ]);
    tab2.tabHeading = 'tab 2';

    service.addTab(tab1);
    service.addTab(tab2);

    expect(service.tabs.length).toBe(2);

    // attempt to destroy tab not existing in service
    service.destroyTab(
      jasmine.createSpyObj('SkyVerticalTabComponent', ['tabDeactivated']),
    );
    expect(service.tabs.length).toBe(2);

    service.destroyTab(tab1);
    expect(service.tabs.length).toBe(1);
    expect(service.tabs[0]).toBe(tab2);
  });
});
