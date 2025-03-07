import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySelectionModalHarness } from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { LookupSelectionModalBasicExampleComponent } from './example.component';
import { ExampleService } from './example.service';

describe('Selection modal example', () => {
  let mockSvc: jasmine.SpyObj<ExampleService>;

  async function setupTest(): Promise<{
    harness: SkySelectionModalHarness;
    el: HTMLElement;
    fixture: ComponentFixture<LookupSelectionModalBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      LookupSelectionModalBasicExampleComponent,
    );
    const el = fixture.nativeElement as HTMLElement;
    const openBtn = el.querySelector<HTMLButtonElement>(
      '.selection-modal-example-show-btn',
    );

    openBtn?.click();
    fixture.detectChanges();

    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const harness = await rootLoader.getHarness(SkySelectionModalHarness);
    return { harness, el, fixture };
  }

  beforeEach(() => {
    // Create a mock search service. In a real-world application, the search
    // service would make a web request which should be avoided in unit tests.
    mockSvc = jasmine.createSpyObj<ExampleService>('ExampleService', [
      'search',
    ]);

    mockSvc.search.and.callFake((searchText) => {
      return of({
        hasMore: false,
        people:
          searchText === 'ra'
            ? [
                {
                  id: '1',
                  name: 'Rachel',
                },
              ]
            : [],
        totalCount: 1,
      });
    });

    TestBed.configureTestingModule({
      imports: [
        LookupSelectionModalBasicExampleComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: ExampleService, useValue: mockSvc }],
    });
  });

  it('should update the selected items list when an item is selected', async () => {
    const { harness, el } = await setupTest();

    await harness.enterSearchText('ra');
    await harness.selectSearchResult({
      contentText: 'Rachel',
    });
    await harness.saveAndClose();

    const selectedItemEls = el.querySelectorAll<HTMLLIElement>(
      '.selection-modal-example-selected li',
    );

    expect(selectedItemEls).toHaveSize(1);
    expect(selectedItemEls[0].innerText.trim()).toBe('Rachel');
  });

  it('should not update the selected items list when the user cancels the selection modal', async () => {
    const { harness, el } = await setupTest();

    await harness.enterSearchText('ra');
    await harness.selectSearchResult({
      contentText: 'Rachel',
    });
    await harness.cancel();

    const selectedItemEls = el.querySelectorAll<HTMLLIElement>(
      '.selection-modal-example-selected li',
    );

    expect(selectedItemEls).toHaveSize(0);
  });

  it('should respect the selection descriptor', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getSearchAriaLabel()).toBeResolvedTo(
      'Search person',
    );
    await expectAsync(harness.getSaveButtonAriaLabel()).toBeResolvedTo(
      'Select person',
    );
  });
});
