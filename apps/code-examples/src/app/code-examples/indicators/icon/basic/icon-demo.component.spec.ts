import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconHarness } from '@skyux/indicators/testing';

import { IconDemoComponent } from './icon-demo.component';
import { IconDemoModule } from './icon-demo.module';

describe('Basic icon', () => {
  async function setupTest(): Promise<{
    iconHarness: SkyIconHarness;
    fixture: ComponentFixture<IconDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(IconDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const iconHarness = await loader.getHarness(
      SkyIconHarness.with({
        dataSkyId: 'icon-demo',
      })
    );

    return { iconHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconDemoModule],
    });
  });

  it('should display the correct icon', async () => {
    const { iconHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('calendar');
    await expectAsync(iconHarness.getIconType()).toBeResolvedTo('skyux');
    await expectAsync(iconHarness.getVariant()).toBeResolvedTo('solid');
    await expectAsync(iconHarness.getIconSize()).toBeResolvedTo('4x');
    await expectAsync(iconHarness.isFixedWidth()).toBeResolvedTo(true);
  });
});
