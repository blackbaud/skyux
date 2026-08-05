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
  it('creates the component and renders the first page of results', async () => {
    const { fixture } = await setupTest();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const items = el.querySelectorAll('li');
    expect(items.length).toBe(3);
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
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

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
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const items = el.querySelectorAll('li');
    expect(items[0].textContent).toContain('Strawberry');
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
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('No fruit found.');
  });
});
