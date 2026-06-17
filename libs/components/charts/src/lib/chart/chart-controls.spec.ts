import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';

import { SkyChartControls } from './chart-controls';
import { SkyChartDataTableModal } from './chart-data-table-modal';

describe('Chart controls component', () => {
  let fixture: ComponentFixture<SkyChartControls>;
  let modalController: SkyModalTestingController;

  function getButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('button');
  }

  function getMenuItemButton(): HTMLButtonElement | null {
    return document.querySelector('.sky-dropdown-item button');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyChartControls, SkyModalTestingModule],
      providers: [provideNoopSkyAnimations()],
    });

    fixture = TestBed.createComponent(SkyChartControls);
    modalController = TestBed.inject(SkyModalTestingController);
  });

  it('should render a context-menu dropdown button', () => {
    fixture.componentRef.setInput('headingText', 'My chart');
    fixture.detectChanges();

    expect(getButton()).toExist();
  });

  it('should label the menu with the heading text', () => {
    fixture.componentRef.setInput('headingText', 'My chart');
    fixture.detectChanges();

    expect(getButton()?.getAttribute('aria-label')).toBe(
      'Context menu for My chart',
    );
  });

  it('should open the data table modal when the menu item is clicked', fakeAsync(() => {
    fixture.componentRef.setInput('headingText', 'My chart');
    fixture.detectChanges();

    // Open the context menu, then click the "view data table" menu item.
    getButton()?.click();
    fixture.detectChanges();
    tick();

    getMenuItemButton()?.click();
    fixture.detectChanges();
    tick();

    modalController.expectCount(1);
    modalController.expectOpen(SkyChartDataTableModal);

    modalController.closeTopModal();
  }));

  it('should close the data table modal when the component is destroyed', fakeAsync(() => {
    fixture.componentRef.setInput('headingText', 'My chart');
    fixture.detectChanges();

    getButton()?.click();
    fixture.detectChanges();
    tick();

    getMenuItemButton()?.click();
    fixture.detectChanges();
    tick();

    modalController.expectCount(1);

    fixture.destroy();

    modalController.expectNone();
  }));

  describe('a11y', () => {
    it('should be accessible', async () => {
      fixture.componentRef.setInput('headingText', 'My chart');
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
