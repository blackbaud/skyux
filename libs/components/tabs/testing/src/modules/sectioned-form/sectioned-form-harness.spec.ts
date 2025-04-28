import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { SectionedFormHarnessTestComponent } from './fixtures/sectioned-form-harness-test.component';
import { SkySectionedFormHarness } from './sectioned-form-harness';

describe('Sectioned form harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    sectionedFormHarness: SkySectionedFormHarness;
    fixture: ComponentFixture<SectionedFormHarnessTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [SectionedFormHarnessTestComponent, NoopAnimationsModule],
      providers: [provideSkyMediaQueryTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(SectionedFormHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const sectionedFormHarness: SkySectionedFormHarness = options.dataSkyId
      ? await loader.getHarness(
          SkySectionedFormHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkySectionedFormHarness);

    return { sectionedFormHarness, fixture };
  }

  it('should get the sectioned form by data-sky-id', async () => {
    const { sectionedFormHarness } = await setupTest({
      dataSkyId: 'sectioned-form',
    });

    await expectAsync(sectionedFormHarness.isSectionsVisible()).toBeResolvedTo(
      true,
    );
  });

  it('should get the active section', async () => {
    const { sectionedFormHarness } = await setupTest();
    const activeSection = await sectionedFormHarness.getActiveSection();
    await expectAsync(activeSection?.getSectionHeading()).toBeResolvedTo(
      'Addresses',
    );

    await expectAsync(activeSection?.getSectionContent()).toBeResolved();
  });

  it('should switch the active section', async () => {
    const { sectionedFormHarness } = await setupTest();
    let activeSection = await sectionedFormHarness.getActiveSection();
    await expectAsync(activeSection?.getSectionHeading()).toBeResolvedTo(
      'Addresses',
    );

    await (
      await sectionedFormHarness.getSection({ sectionHeading: 'Phone numbers' })
    ).click();

    await expectAsync(activeSection?.isActive()).toBeResolvedTo(false);

    activeSection = await sectionedFormHarness.getActiveSection();
    await expectAsync(activeSection?.getSectionHeading()).toBeResolvedTo(
      'Phone numbers',
    );
  });

  it('should return undefined when no section is active', async () => {
    const { sectionedFormHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('activeTab', false);
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(sectionedFormHarness.getActiveSection()).toBeResolvedTo(
      undefined,
    );
  });

  it('should get the active section content harness', async () => {
    const { sectionedFormHarness } = await setupTest();
    const activeSectionContent =
      await sectionedFormHarness.getActiveSectionContent();
    await expectAsync(activeSectionContent?.isVisible()).toBeResolvedTo(true);
  });

  it('should return no content when there is no active section', async () => {
    const { sectionedFormHarness, fixture } = await setupTest();
    fixture.componentRef.setInput('activeTab', false);
    // fixture.componentInstance.activeTab = false;
    fixture.detectChanges();

    await expectAsync(
      sectionedFormHarness.getActiveSectionContent(),
    ).toBeResolvedTo(undefined);
  });

  it('should get section harness by heading', async () => {
    const { sectionedFormHarness } = await setupTest();
    await expectAsync(
      sectionedFormHarness.getSection({
        sectionHeading: 'Addresses',
      }),
    ).toBeResolved();
  });

  it('should get all sections in the sectioned form', async () => {
    const { sectionedFormHarness } = await setupTest();
    const sections = await sectionedFormHarness.getSections();
    expect(sections.length).toBe(3);
  });

  it('should throw an error if no sections are found matching criteria', async () => {
    const { sectionedFormHarness } = await setupTest();

    await expectAsync(
      sectionedFormHarness.getSections({ dataSkyId: 'some-section' }),
    ).toBeRejectedWithError(
      'Unable to find any sectioned form sections with filter(s): {"dataSkyId":"some-section"}',
    );
  });

  it('should get the section header count', async () => {
    const { sectionedFormHarness } = await setupTest();

    const activeSection = await sectionedFormHarness.getActiveSection();

    await expectAsync(activeSection?.getSectionItemCount()).toBeResolvedTo(2);
  });

  describe('in mobile view', () => {
    let mediaQueryController: SkyMediaQueryTestingController;

    function shrinkScreen(
      fixture: ComponentFixture<SectionedFormHarnessTestComponent>,
    ): void {
      mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
      mediaQueryController.setBreakpoint('xs');
      fixture.detectChanges();
    }

    it('should get the active content', async () => {
      const { sectionedFormHarness, fixture } = await setupTest();
      shrinkScreen(fixture);

      const content = await sectionedFormHarness.getActiveSectionContent();
      await expectAsync(content?.isVisible()).toBeResolvedTo(true);
    });

    it('should throw an error when trying to get the active content in section view', async () => {
      const { sectionedFormHarness, fixture } = await setupTest();
      shrinkScreen(fixture);

      fixture.componentInstance.showTabs();
      fixture.detectChanges();

      await expectAsync(
        sectionedFormHarness.getActiveSectionContent(),
      ).toBeRejectedWithError(
        'Unable to find active content because it is not visible.',
      );
    });

    it('should switch between section view and content view', async () => {
      const { sectionedFormHarness, fixture } = await setupTest();
      shrinkScreen(fixture);
      await expectAsync(
        sectionedFormHarness.isSectionsVisible(),
      ).toBeResolvedTo(false);

      await expectAsync(
        sectionedFormHarness.getSections(),
      ).toBeRejectedWithError(
        'Unable to find any sectioned form sections because they are not visible.',
      );

      fixture.componentInstance.showTabs();
      fixture.detectChanges();

      const sections = await sectionedFormHarness.getSections();
      await expectAsync(
        sectionedFormHarness.isSectionsVisible(),
      ).toBeResolvedTo(true);
      expect(sections.length).toBe(3);

      await sections[2].click();
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(
        sectionedFormHarness.isSectionsVisible(),
      ).toBeResolvedTo(false);
    });
  });
});
