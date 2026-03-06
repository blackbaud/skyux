import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySortHarness } from '@skyux/lists/testing';

import { ListsSortBasicExampleComponent } from './example.component';

describe('Sort demo', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    sortHarness: SkySortHarness;
    fixture: ComponentFixture<ListsSortBasicExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [ListsSortBasicExampleComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(ListsSortBasicExampleComponent);
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

  it('should set up the component', async () => {
    const { sortHarness } = await setupTest();

    await sortHarness.click();

    const items = await sortHarness.getItems();

    await expectAsync(items[0].isActive()).toBeResolvedTo(false);
    await expectAsync(items[1].getText()).toBeResolvedTo('Assigned to (Z - A)');
    await expectAsync(items[2].isActive()).toBeResolvedTo(true);

    await items[3].click();

    await expectAsync(items[3].isActive()).toBeResolvedTo(true);
  });
});
