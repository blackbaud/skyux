import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpTestingModule } from '@skyux/core/testing';
import { SkyDescriptionListHarness } from '@skyux/layout/testing';

import { LayoutDescriptionListLongDescriptionExampleComponent } from './example.component';

describe('Long description list', () => {
  async function setupTest(): Promise<{
    descriptionListHarness: SkyDescriptionListHarness;
    fixture: ComponentFixture<LayoutDescriptionListLongDescriptionExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [
        LayoutDescriptionListLongDescriptionExampleComponent,
        SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      LayoutDescriptionListLongDescriptionExampleComponent,
    );
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
