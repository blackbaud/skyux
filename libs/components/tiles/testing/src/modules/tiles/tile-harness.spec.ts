import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { Tile1Component } from './fixtures/tile1.component';
import { SkyTileHarness } from './tile-harness';

describe('Tile test harness', () => {
  async function setupTest(): Promise<{
    tileHarness: SkyTileHarness;
    fixture: ComponentFixture<Tile1Component>;
  }> {
    await TestBed.configureTestingModule({
      imports: [Tile1Component, SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(Tile1Component);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const tileHarness: SkyTileHarness = await loader.getHarness(SkyTileHarness);

    return { tileHarness, fixture };
  }

  it('should click the settings button', async () => {
    const { tileHarness, fixture } = await setupTest();

    const clickSpy = spyOn(fixture.componentInstance, 'tileSettingsClick');
    await tileHarness.clickSettingsButton();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should throw an error if clicking the settings button when it is not present', async () => {
    const { tileHarness, fixture } = await setupTest();

    fixture.componentInstance.showSettings = false;
    fixture.detectChanges();
    await fixture.whenStable();

    const clickSpy = spyOn(fixture.componentInstance, 'tileSettingsClick');
    await expectAsync(tileHarness.clickSettingsButton()).toBeRejectedWithError(
      'No settings button found.',
    );
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should expand and collapse the tile', async () => {
    const { tileHarness } = await setupTest();

    await expectAsync(tileHarness.isExpanded()).toBeResolvedTo(true);

    await tileHarness.collapse();

    await expectAsync(tileHarness.isExpanded()).toBeResolvedTo(false);

    await tileHarness.expand();

    await expectAsync(tileHarness.isExpanded()).toBeResolvedTo(true);
  });

  it('should get the title and summary text', async () => {
    const { tileHarness } = await setupTest();

    await expectAsync(tileHarness.getTitleText()).toBeResolvedTo('Tile 1');
    await expectAsync(tileHarness.getSummaryText()).toBeResolvedTo('$123.4m');
  });

  it('should get the tile content', async () => {
    const { tileHarness } = await setupTest();

    await expectAsync(tileHarness.getContent()).toBeResolved();
  });

  it('should get a tile content section by data-sky-id', async () => {
    const { tileHarness } = await setupTest();

    const contentHarness = await tileHarness.getContent();

    await expectAsync(
      contentHarness.getSection({ dataSkyId: 'section-1' }),
    ).toBeResolved();
  });

  it('should get an array of all tile content sections', async () => {
    const { tileHarness } = await setupTest();

    const contentHarness = await tileHarness.getContent();

    const sections = await contentHarness.getSections();

    expect(sections.length).toBe(3);
  });

  it('should get an array tile content sections based on criteria', async () => {
    const { tileHarness } = await setupTest();

    const contentHarness = await tileHarness.getContent();

    const sections = await contentHarness.getSections({
      dataSkyId: 'section-1',
    });

    expect(sections.length).toBe(1);
  });

  it('should throw an error if no tile content sections are found', async () => {
    const { tileHarness, fixture } = await setupTest();

    fixture.componentInstance.showSections = false;
    fixture.detectChanges();
    await fixture.whenStable();

    const contentHarness = await tileHarness.getContent();

    await expectAsync(contentHarness.getSections()).toBeResolvedTo([]);
  });

  it('should throw an error if no help inline is found', async () => {
    const { tileHarness } = await setupTest();

    await expectAsync(tileHarness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should open help inline popover when clicked', async () => {
    const { tileHarness, fixture } = await setupTest();

    fixture.componentInstance.helpContent = 'help content';
    fixture.detectChanges();

    await tileHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(tileHarness.getHelpPopoverContent()).toBeResolved();
  });

  it('should open help widget when clicked', async () => {
    const { tileHarness, fixture } = await setupTest();

    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');
    fixture.componentInstance.helpKey = 'helpKey.html';
    fixture.componentInstance.helpContent = undefined;
    fixture.detectChanges();

    await tileHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });

  it('should get help popover content', async () => {
    const helpContent = 'test help content';
    const { tileHarness, fixture } = await setupTest();

    fixture.componentInstance.helpContent = helpContent;
    await tileHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(tileHarness.getHelpPopoverContent()).toBeResolvedTo(
      helpContent,
    );
  });

  it('should get help popover title', async () => {
    const helpTitle = 'test title';
    const helpContent = 'test content';
    const { tileHarness, fixture } = await setupTest();

    fixture.componentInstance.helpContent = helpContent;
    fixture.componentInstance.helpTitle = helpTitle;
    await tileHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(tileHarness.getHelpPopoverTitle()).toBeResolvedTo(
      helpTitle,
    );
  });
});
