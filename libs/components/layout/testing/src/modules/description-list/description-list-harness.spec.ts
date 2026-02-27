import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { SkyDescriptionListHarness } from './description-list-harness';
import { DescriptionListHarnessTestComponent } from './fixtures/description-list-test.component';

describe('Description list test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    descriptionListHarness: SkyDescriptionListHarness;
    fixture: ComponentFixture<DescriptionListHarnessTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [
        DescriptionListHarnessTestComponent,
        SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      DescriptionListHarnessTestComponent,
    );
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const descriptionListHarness: SkyDescriptionListHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyDescriptionListHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyDescriptionListHarness);

    return { descriptionListHarness, fixture };
  }

  it('should get a description list by data-sky-id and return the mode', async () => {
    const { descriptionListHarness, fixture } = await setupTest({
      dataSkyId: 'description-list',
    });

    await expectAsync(descriptionListHarness.getMode()).toBeResolvedTo(
      'vertical',
    );

    fixture.componentInstance.mode = 'horizontal';
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(descriptionListHarness.getMode()).toBeResolvedTo(
      'horizontal',
    );

    fixture.componentInstance.mode = 'longDescription';
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(descriptionListHarness.getMode()).toBeResolvedTo(
      'longDescription',
    );
  });

  it('should get the description list content, terms, and descriptions', async () => {
    const { descriptionListHarness } = await setupTest({
      dataSkyId: 'description-list',
    });

    const items = await descriptionListHarness.getContent();

    expect(items.length).toBe(5);

    await expectAsync(items[0].getTermText()).toBeResolvedTo('College');
    await expectAsync(items[0].getDescriptionText()).toBeResolvedTo(
      'Humanities and Social Sciences',
    );
    await expectAsync(items[1].getDescriptionText()).toBeResolvedTo(
      'None found.',
    );
  });

  it('should throw an error if description list terms or descriptions are not found', async () => {
    const { descriptionListHarness } = await setupTest({
      dataSkyId: 'description-list',
    });

    const items = await descriptionListHarness.getContent();

    await expectAsync(items[2].getTermText()).toBeRejectedWithError(
      'No description list term found.',
    );
    await expectAsync(items[2].getDescriptionText()).toBeRejectedWithError(
      'No description list description found.',
    );
  });

  it('should throw an error if no description list content items are found', async () => {
    const { descriptionListHarness } = await setupTest({
      dataSkyId: 'empty-list',
    });

    await expectAsync(
      descriptionListHarness.getContent(),
    ).toBeRejectedWithError('Unable to find any description list content.');
  });

  it('should throw an error if no help inline is found', async () => {
    const { descriptionListHarness } = await setupTest({
      dataSkyId: 'description-list',
    });

    const contentHarness = (await descriptionListHarness.getContent())[0];

    await expectAsync(contentHarness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should get help popover content and title', async () => {
    const { descriptionListHarness, fixture } = await setupTest();

    const contentHarness = (await descriptionListHarness.getContent())[3];

    await contentHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(contentHarness.getHelpPopoverContent()).toBeResolvedTo(
      'The faculty member who advises the student.',
    );
    await expectAsync(contentHarness.getHelpPopoverTitle()).toBeResolvedTo(
      `Help inline title`,
    );
  });

  it('should open help widget when clicked', async () => {
    const { descriptionListHarness, fixture } = await setupTest({
      dataSkyId: 'description-list',
    });

    const contentHarness = (await descriptionListHarness.getContent())[4];

    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');

    await contentHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });
});
