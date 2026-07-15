import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyModalInstance, SkyModalService } from '@skyux/modals';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyModalHarness } from '@skyux/modals/testing';

import { type SkyChartTable } from './chart-table';
import {
  SkyChartTableModal,
  SkyChartTableModalContext,
} from './chart-table-modal';

@Component({
  template: '',
})
class TestComponent {}

const TEST_TABLE: SkyChartTable = {
  categoryLabel: 'Year',
  categories: ['2023', '2024'],
  series: [{ label: 'Acquisitions', values: ['$10.00', '$20.00'] }],
};

describe('Chart data table modal', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;
  let modalSvc: SkyModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideNoopSkyAnimations()],
    });

    fixture = TestBed.createComponent(TestComponent);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    modalSvc = TestBed.inject(SkyModalService);
  });

  async function openModal(
    headingText: string,
    table?: SkyChartTable,
  ): Promise<{
    instance: SkyModalInstance;
    modalHarness: SkyModalHarness;
  }> {
    const instance = modalSvc.open(SkyChartTableModal, {
      providers: [
        {
          provide: SkyChartTableModalContext,
          useValue: { headingText, table },
        },
      ],
    });

    const modalHarness = await loader.getHarness(SkyModalHarness);

    return { instance, modalHarness };
  }

  it('should display the heading text from the modal context', async () => {
    const { instance, modalHarness } = await openModal('My chart');

    await expectAsync(modalHarness.getHeadingText()).toBeResolvedTo('My chart');

    instance.close();
  });

  it('should render the table from the modal context', async () => {
    const { instance } = await openModal('My chart', TEST_TABLE);

    const table = document.querySelector('.sky-chart-data-table');
    expect(table?.querySelector('thead th')?.textContent?.trim()).toBe('Year');
    expect(table?.querySelector('tbody td')?.textContent?.trim()).toBe(
      '$10.00',
    );

    instance.close();
  });

  it('should render the table in a focusable, horizontally scrollable region', async () => {
    const { instance } = await openModal('My chart', TEST_TABLE);

    const wrapper = document.querySelector(
      '.sky-chart-data-table-wrapper',
    ) as HTMLElement;

    expect(wrapper.querySelector('.sky-chart-data-table')).toExist();
    expect(getComputedStyle(wrapper).overflowX).toBe('auto');
    expect(wrapper.getAttribute('role')).toBe('region');
    expect(wrapper.getAttribute('tabindex')).toBe('0');
    expect(wrapper.getAttribute('aria-label')).toBe('Data table for My chart');

    instance.close();
  });

  it('should right-align the series column headers and values', async () => {
    const { instance } = await openModal('My chart', TEST_TABLE);

    const headers = document.querySelectorAll('.sky-chart-data-table thead th');
    const valueCell = document.querySelector('.sky-chart-data-table tbody td');

    expect(getComputedStyle(headers[0]).textAlign).toBe('left');
    expect(getComputedStyle(headers[1]).textAlign).toBe('right');
    expect(getComputedStyle(valueCell as Element).textAlign).toBe('right');

    instance.close();
  });

  it('should draw a bottom border on each row except the last', async () => {
    const { instance } = await openModal('My chart', TEST_TABLE);

    const rows = Array.from(
      document.querySelectorAll('.sky-chart-data-table tr'),
    );
    const lastRow = rows.pop() as Element;

    for (const row of rows) {
      const style = getComputedStyle(row);
      expect(style.borderBottomWidth).toBe('1px');
      expect(style.borderBottomStyle).toBe('solid');
    }

    expect(getComputedStyle(lastRow).borderBottomWidth).toBe('0px');

    instance.close();
  });

  describe('a11y', () => {
    it('should be accessible without a table', async () => {
      const { instance } = await openModal('My chart');

      await expectAsync(document.querySelector('.sky-modal')).toBeAccessible();

      instance.close();
    });

    it('should be accessible with a table', async () => {
      const { instance } = await openModal('My chart', TEST_TABLE);

      await expectAsync(document.querySelector('.sky-modal')).toBeAccessible();

      instance.close();
    });
  });
});
