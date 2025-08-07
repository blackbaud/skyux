import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconHarness } from '@skyux/icon/testing';

import { IconIconButtonExampleComponent } from './example.component';

describe('Icon button', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    iconHarness: SkyIconHarness;
    fixture: ComponentFixture<IconIconButtonExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(IconIconButtonExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const iconHarness = await loader.getHarness(
      SkyIconHarness.with({
        dataSkyId: options?.dataSkyId,
      }),
    );

    return { iconHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconIconButtonExampleComponent],
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
