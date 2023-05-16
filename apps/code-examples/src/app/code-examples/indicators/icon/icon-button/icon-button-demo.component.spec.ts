import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconHarness } from '@skyux/indicators/testing';

import { IconDemoComponent } from './icon-button-demo.component';
import { IconDemoModule } from './icon-button-demo.module';

describe('Icon button', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    iconHarness: SkyIconHarness;
    fixture: ComponentFixture<IconDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(IconDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const iconHarness = await loader.getHarness(
      SkyIconHarness.with({
        dataSkyId: options?.dataSkyId,
      })
    );

    return { iconHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconDemoModule],
    });
  });

  it('should display the icon in the text icon button', async () => {
    const { iconHarness, fixture } = await setupTest({
      dataSkyId: 'text-button-icon',
    });

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('save');
  });

  it('should display the icon in the icon only button', async () => {
    const { iconHarness, fixture } = await setupTest({
      dataSkyId: 'button-icon',
    });

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('edit');
  });
});
