import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';

import { IconIconButtonExampleComponent } from './example.component';

describe('Icon button', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    buttonHarness: SkyButtonHarness;
    fixture: ComponentFixture<IconIconButtonExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(IconIconButtonExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const buttonHarness = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId: options?.dataSkyId,
      }),
    );

    return { buttonHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconIconButtonExampleComponent],
    });
  });

  it('should display the icon in the text icon button', async () => {
    const { buttonHarness, fixture } = await setupTest({
      dataSkyId: 'text-button',
    });

    fixture.detectChanges();

    await expectAsync(buttonHarness.getIconName()).toBeResolvedTo('save');
  });

  it('should display the icon in the icon only button', async () => {
    const { buttonHarness, fixture } = await setupTest({
      dataSkyId: 'icon-only-button',
    });

    fixture.detectChanges();

    await expectAsync(buttonHarness.getIconName()).toBeResolvedTo('edit');
    await expectAsync(buttonHarness.getLabelText()).toBeResolvedTo('Edit');
    await expectAsync(buttonHarness.getLabelHidden()).toBeResolvedTo(true);
  });
});
