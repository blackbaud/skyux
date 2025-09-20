import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SortHarnessTestComponent } from './fixtures/sort-harness-test.component';
import { SkySortHarness } from './sort-harness';

describe('Sort test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    sortHarness: SkySortHarness;
    fixture: ComponentFixture<SortHarnessTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [SortHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(SortHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const sortHarness: SkySortHarness = options.dataSkyId
      ? await loader.getHarness(
          SkySortHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkySortHarness);

    return { sortHarness, fixture };
  }

  it('should get the sort component by data-sky-id', async () => {
    const { sortHarness } = await setupTest({ dataSkyId: 'other-sort' });

    await expectAsync(sortHarness.getButtonText()).toBeResolvedTo('');
  });

  it('should get the aria-label', async () => {
    const { sortHarness } = await setupTest();

    await expectAsync(sortHarness.getAriaLabel()).toBeResolvedTo('Sort');
  });

  it('should get the sort button text', async () => {
    const { sortHarness } = await setupTest();

    await expectAsync(sortHarness.getButtonText()).toBeResolvedTo('Sort');
  });

  it('should get a sort item by criteria', async () => {
    const { sortHarness, fixture } = await setupTest();

    await sortHarness.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const itemHarness = await sortHarness.getItem({
      text: 'Date created (newest first)',
    });

    await expectAsync(itemHarness.getAriaRole()).toBeResolvedTo('menuitem');
    await expectAsync(itemHarness.getText()).toBeResolvedTo(
      'Date created (newest first)',
    );
    await expectAsync(itemHarness.isActive()).toBeResolvedTo(true);
    await itemHarness.click();
  });

  it('should get an array of sort items', async () => {
    const { sortHarness, fixture } = await setupTest();

    await expectAsync(sortHarness.getItems()).toBeRejectedWithError(
      'Unable to locate any sort items because the sort menu is not open.',
    );

    await sortHarness.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const items = await sortHarness.getItems();

    expect(items.length).toBe(6);
  });
});
