import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyIconHarness } from '@skyux/indicators/testing';

import { IconDemoComponent } from './icon-button-demo.component';
import { IconDemoModule } from './icon-button-demo.module';

describe('Icon button', async () => {
  async function setupTest(options: {
    dataSkyId?: string;
  }): Promise<SkyIconHarness> {
    const fixture = TestBed.createComponent(IconDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const iconHarness = await loader.getHarness(
      SkyIconHarness.with({
        dataSkyId: options?.dataSkyId,
      })
    );
    fixture.detectChanges();
    return iconHarness;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconDemoModule],
    });
  });

  fit('should display the icon in the text icon button', async () => {
    const iconHarness = await setupTest({ dataSkyId: 'text-button-icon' });
    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('save');
  });

  fit('should display the icon in the icon only button', async () => {
    const iconHarness = await setupTest({ dataSkyId: 'button-icon' });
    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('edit');
  });
});
