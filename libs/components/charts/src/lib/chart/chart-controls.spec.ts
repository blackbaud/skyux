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

import { SkyChartTableModal } from '../chart-table/chart-table-modal';
import { SkyChartTableService } from '../chart-table/chart-table-service';

import { SkyChartControls } from './chart-controls';

describe('Chart controls component', () => {
  let fixture: ComponentFixture<SkyChartControls>;
  let modalController: SkyModalTestingController;
  let tableSvc: SkyChartTableService;

  function getButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('button');
  }

  function getMenuItemButton(): HTMLButtonElement | null {
    return document.querySelector('.sky-dropdown-item button');
  }

  function setTable(): void {
    tableSvc.table.set({
      categoryLabel: 'Year',
      categories: ['2023'],
      series: [{ label: 'Acquisitions', values: ['10'] }],
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyChartControls, SkyModalTestingModule],
      providers: [provideNoopSkyAnimations(), SkyChartTableService],
    });

    fixture = TestBed.createComponent(SkyChartControls);
    modalController = TestBed.inject(SkyModalTestingController);
    tableSvc = TestBed.inject(SkyChartTableService);
  });

  it('should not render the context menu when no data table is available', () => {
    fixture.componentRef.setInput('headingText', 'My chart');
    fixture.detectChanges();

    expect(getButton()).toBeNull();
  });

  it('should remove the context menu when the data table is cleared', () => {
    fixture.componentRef.setInput('headingText', 'My chart');
    setTable();
    fixture.detectChanges();

    expect(getButton()).toExist();

    tableSvc.table.set(undefined);
    fixture.detectChanges();

    expect(getButton()).toBeNull();
  });

  it('should render a context-menu dropdown button', () => {
    fixture.componentRef.setInput('headingText', 'My chart');
    setTable();
    fixture.detectChanges();

    expect(getButton()).toExist();
  });

  it('should label the menu with the heading text', () => {
    fixture.componentRef.setInput('headingText', 'My chart');
    setTable();
    fixture.detectChanges();

    expect(getButton()?.getAttribute('aria-label')).toBe(
      'Context menu for My chart',
    );
  });

  it('should open the data table modal when the menu item is clicked', fakeAsync(() => {
    fixture.componentRef.setInput('headingText', 'My chart');
    setTable();
    fixture.detectChanges();

    // Open the context menu, then click the "view data table" menu item.
    getButton()?.click();
    fixture.detectChanges();
    tick();

    getMenuItemButton()?.click();
    fixture.detectChanges();
    tick();

    modalController.expectCount(1);
    modalController.expectOpen(SkyChartTableModal);

    modalController.closeTopModal();
  }));

  it('should close the data table modal when the component is destroyed', fakeAsync(() => {
    fixture.componentRef.setInput('headingText', 'My chart');
    setTable();
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
      setTable();
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
