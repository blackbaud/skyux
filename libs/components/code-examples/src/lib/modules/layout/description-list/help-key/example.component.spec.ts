import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyDescriptionListHarness } from '@skyux/layout/testing';

import { LayoutDescriptionListHelpKeyExampleComponent } from './example.component';

describe('Help key description list', () => {
  async function setupTest(): Promise<{
    descriptionListHarness: SkyDescriptionListHarness;
    fixture: ComponentFixture<LayoutDescriptionListHelpKeyExampleComponent>;
    helpController: SkyHelpTestingController;
  }> {
    await TestBed.configureTestingModule({
      imports: [
        LayoutDescriptionListHelpKeyExampleComponent,
        SkyHelpTestingModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      LayoutDescriptionListHelpKeyExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const helpController = TestBed.inject(SkyHelpTestingController);

    const descriptionListHarness: SkyDescriptionListHarness =
      await loader.getHarness(SkyDescriptionListHarness);

    return { descriptionListHarness, fixture, helpController };
  }

  it('should set up the component', async () => {
    const { descriptionListHarness, fixture, helpController } =
      await setupTest();

    await expectAsync(descriptionListHarness.getMode()).toBeResolvedTo(
      'horizontal',
    );

    const content = await descriptionListHarness.getContent();

    expect(content.length).toBe(4);

    await expectAsync(content[0].getTermText()).toBeResolvedTo('College');
    await expectAsync(content[0].getDescriptionText()).toBeResolvedTo(
      'Humanities and Social Sciences',
    );

    await content[0].clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    helpController.expectCurrentHelpKey('college-help');
  });
});
