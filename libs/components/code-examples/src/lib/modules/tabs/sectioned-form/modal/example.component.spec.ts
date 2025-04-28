import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkySectionedFormHarness } from '@skyux/tabs/testing';

import { TabsSectionedFormModalExampleComponent } from './example.component';

describe('Sectioned form in a modal example', () => {
  async function setupTest(): Promise<{
    sectionedFormHarness: SkySectionedFormHarness;
    fixture: ComponentFixture<TabsSectionedFormModalExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TabsSectionedFormModalExampleComponent, NoopAnimationsModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(
      TabsSectionedFormModalExampleComponent,
    );
    fixture.componentInstance.openModal();

    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const sectionedFormHarness: SkySectionedFormHarness =
      await loader.getHarness(
        SkySectionedFormHarness.with({ dataSkyId: 'modal-sectioned-form' }),
      );

    return { sectionedFormHarness, fixture };
  }

  it('should set up the sectioned form', async () => {
    const { sectionedFormHarness } = await setupTest();
    let activeSection = await sectionedFormHarness.getActiveSection();
    await expectAsync(activeSection?.getSectionHeading()).toBeResolvedTo(
      'Addresses',
    );
    await expectAsync(activeSection?.getSectionItemCount()).toBeResolvedTo(2);

    await (
      await sectionedFormHarness.getSection({
        sectionHeading: 'Basic information',
      })
    ).click();

    await expectAsync(activeSection?.isActive()).toBeResolvedTo(false);

    activeSection = await sectionedFormHarness.getActiveSection();
    await expectAsync(activeSection?.getSectionHeading()).toBeResolvedTo(
      'Basic information',
    );

    const activeContent = await sectionedFormHarness.getActiveSectionContent();

    const idField = await (
      await activeContent?.queryHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'id-field' }),
      )
    )?.querySelector('input');

    await expectAsync(idField?.getProperty('value')).toBeResolvedTo('5324901');
  });
});
