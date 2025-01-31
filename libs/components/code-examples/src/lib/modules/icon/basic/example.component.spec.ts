import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconHarness } from '@skyux/indicators/testing';

import { IconBasicExampleComponent } from './example.component';

describe('Basic icon', () => {
  async function setupTest(): Promise<{
    iconHarness: SkyIconHarness;
    fixture: ComponentFixture<IconBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(IconBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const iconHarness = await loader.getHarness(
      SkyIconHarness.with({
        dataSkyId: 'icon-example',
      }),
    );

    return { iconHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IconBasicExampleComponent],
    });
  });

  it('should display the correct icon', async () => {
    const { iconHarness, fixture } = await setupTest();

    fixture.detectChanges();

    await expectAsync(iconHarness.getIconName()).toBeResolvedTo('calendar');
    await expectAsync(iconHarness.getVariant()).toBeRejectedWithError(
      'Variant cannot be determined because variants are only assigned to icons with type `skyux`.',
    );
    await expectAsync(iconHarness.getIconSize()).toBeResolvedTo('4x');
    await expectAsync(iconHarness.isFixedWidth()).toBeResolvedTo(true);
  });
});
