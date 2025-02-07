import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyHelpTestingModule } from '@skyux/core/testing';
import { SkyDescriptionListHarness } from '@skyux/layout/testing';

import { DemoComponent } from './demo.component';

describe('Long description list', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    descriptionListHarness: SkyDescriptionListHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent, SkyHelpTestingModule, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const descriptionListHarness: SkyDescriptionListHarness =
      await loader.getHarness(SkyDescriptionListHarness);

    return { descriptionListHarness, fixture };
  }

  it('should set up the component', async () => {
    const { descriptionListHarness } = await setupTest();

    await expectAsync(descriptionListHarness.getMode()).toBeResolvedTo(
      'longDescription',
    );

    const content = await descriptionListHarness.getContent();

    expect(content.length).toBe(3);

    await expectAsync(content[0].getTermText()).toBeResolvedTo(
      'Good Health and Well-being',
    );
    await expectAsync(content[0].getDescriptionText()).toBeResolvedTo(
      'Ensure healthy lives and promote well-being for all at all ages.',
    );
  });
});
