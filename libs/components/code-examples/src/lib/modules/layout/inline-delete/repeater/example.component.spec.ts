import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyInlineDeleteHarness } from '@skyux/layout/testing';

import { LayoutInlineDeleteRepeaterExampleComponent } from './example.component';

describe('Custom component inline delete example', () => {
  async function setupTest(options: { itemTitle: string }): Promise<{
    deleteHarness: SkyInlineDeleteHarness;
    fixture: ComponentFixture<LayoutInlineDeleteRepeaterExampleComponent>;
  }> {
    TestBed.configureTestingModule({
      imports: [LayoutInlineDeleteRepeaterExampleComponent],
      providers: [provideNoopSkyAnimations()],
    });
    const fixture = TestBed.createComponent(
      LayoutInlineDeleteRepeaterExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    fixture.componentInstance.showInlineDelete(options.itemTitle);
    fixture.detectChanges();

    const deleteHarness = await loader.getHarness(SkyInlineDeleteHarness);

    return { deleteHarness, fixture };
  }

  it('should setup inline delete for repeater item', async () => {
    const { deleteHarness, fixture } = await setupTest({
      itemTitle: 'Individual',
    });

    await deleteHarness.clickDeleteButton();

    expect(fixture.componentInstance.repeaterDemoItems.length).toBe(2);
  });
});
