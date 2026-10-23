import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLiveAnnouncerService, provideNoopSkyAnimations } from '@skyux/core';
import { SkyDataManagerHarness } from '@skyux/data-manager/testing';
import { SkySortHarness } from '@skyux/lists/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { DataManagerResourceExample } from './example';

async function setupTest(): Promise<{
  fixture: ComponentFixture<DataManagerResourceExample>;
  loader: HarnessLoader;
}> {
  await TestBed.configureTestingModule({
    imports: [DataManagerResourceExample],
    providers: [provideNoopSkyAnimations()],
  }).compileComponents();

  const fixture = TestBed.createComponent(DataManagerResourceExample);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  return { fixture, loader };
}

describe('DataManagerResourceExample', () => {
  it('registers a single list view from the template', async () => {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();

    const manager = await loader.getHarness(SkyDataManagerHarness);
    expect((await manager.getViews()).length).toBe(1);
    await expectAsync(manager.getView({ viewId: 'list' })).toBeResolved();

    const toolbar = await manager.getToolbar();
    expect(await toolbar.getSearch()).not.toBeNull();
    expect(await toolbar.getViewActions()).toBeNull();
  });

  it('creates the component and renders all results', async () => {
    const { fixture } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const items = el.querySelectorAll('li');
    expect(items.length).toBe(6);
  });

  it('filters results using the search box harness', async () => {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const search = await loader.getHarness(SkySearchHarness);
    await search.enterText('lime');

    const el = fixture.nativeElement as HTMLElement;
    const items = el.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Lime');
  });

  it('keeps the previous results while a search loads', async () => {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();

    const announceSpy = spyOn(
      TestBed.inject(SkyLiveAnnouncerService),
      'announce',
    );

    const search = await loader.getHarness(SkySearchHarness);
    await search.enterText('lime');

    const announcements = announceSpy.calls.allArgs().map(([text]) => text);
    expect(announcements).toContain('1 of 1 items meet criteria.');
    expect(announcements).not.toContain('0 of 0 items meet criteria.');
  });

  it('sorts results using the sort harness', async () => {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const sort = await loader.getHarness(SkySortHarness);
    await sort.click();
    const item = await sort.getItem({ text: 'Name (Z - A)' });
    await item.click();

    const el = fixture.nativeElement as HTMLElement;
    const items = el.querySelectorAll('li');
    expect(items[0].textContent).toContain('Strawberry');
  });

  it('applies each sort option selected in turn', async () => {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();

    const sort = await loader.getHarness(SkySortHarness);
    const el = fixture.nativeElement as HTMLElement;

    for (const [label, first] of [
      ['Name (Z - A)', 'Strawberry'],
      ['Name (A - Z)', 'Banana'],
      ['Name (Z - A)', 'Strawberry'],
    ]) {
      await sort.click();
      await (await sort.getItem({ text: label })).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(el.querySelector('li')?.textContent).toContain(first);
    }
  });

  it('shows an empty state when no fruit matches', async () => {
    const { fixture, loader } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const search = await loader.getHarness(SkySearchHarness);
    await search.enterText('nonexistent');

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('No fruit found.');
  });
});
