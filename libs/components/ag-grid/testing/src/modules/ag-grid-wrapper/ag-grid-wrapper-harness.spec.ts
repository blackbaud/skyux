import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAgGridModule } from '@skyux/ag-grid';

import { SkyAgGridWrapperHarness } from './ag-grid-wrapper-harness';

@Component({
  selector: 'app-test',
  template: `<sky-ag-grid-wrapper data-sky-id="wrapper" />`,
  imports: [SkyAgGridModule],
})
class TestComponent {}

describe('SkyAgGridWrapperHarness', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should check if the grid is ready', async () => {
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'wrapper' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
  });

  it('should throw error if the grid is not available', async () => {
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'wrapper' }),
    );
    await expectAsync(harness.isGridReady()).toBeResolvedTo(false);
    await expectAsync(harness.getDisplayedColumnIds()).toBeRejectedWith(
      'Unable to retrieve displayed column IDs.',
    );
    await expectAsync(harness.getDisplayedColumnHeaderNames()).toBeRejectedWith(
      'Unable to retrieve displayed column header names.',
    );
  });
});
