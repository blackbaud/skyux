import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkySortHarness } from '@skyux/lists/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { DataManagerResourceExampleComponent } from './example.component';

async function setupTest(): Promise<{
  fixture: ComponentFixture<DataManagerResourceExampleComponent>;
  loader: HarnessLoader;
}> {
  await TestBed.configureTestingModule({
    imports: [DataManagerResourceExampleComponent],
    providers: [provideNoopSkyAnimations()],
  }).compileComponents();

  const fixture = TestBed.createComponent(DataManagerResourceExampleComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  return { fixture, loader };
}

describe('DataManagerResourceExampleComponent', () => {
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
