import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';

import { DataGridDataManagerExampleComponent } from './example.component';

describe('Data grid data manager example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DataGridDataManagerExampleComponent>;
    gridHarness: SkyDataGridHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataGridDataManagerExampleComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(
      DataGridDataManagerExampleComponent,
    );
    const loader: HarnessLoader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(SkyDataGridHarness);
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);

    return { fixture, gridHarness };
  }

  it('should create the component', async () => {
    const { fixture, gridHarness } = await setupTest();

    expect(fixture.componentInstance).toBeDefined();
    await expectAsync(gridHarness.getDisplayedRowCount()).toBeResolvedTo(7);
  });

  it('should hide the column marked columnHidden', async () => {
    const { gridHarness } = await setupTest();

    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'name',
      'type',
      'color',
    ]);
  });

  it('should display a column picker button', async () => {
    const { fixture } = await setupTest();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.sky-col-picker-btn',
      ),
    ).toBeTruthy();
  });
});
