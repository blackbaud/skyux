import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySelectionModalHarness } from '@skyux/lookup/testing';

import { of } from 'rxjs';

import { SelectionModalDemoComponent } from './selection-modal-demo.component';
import { SelectionModalDemoModule } from './selection-modal-demo.module';
import { SelectionModalDemoService } from './selection-modal-demo.service';

describe('Selection modal demo', () => {
  let mockSvc: jasmine.SpyObj<SelectionModalDemoService>;

  async function setupTest(): Promise<{
    harness: SkySelectionModalHarness;
    fixture: ComponentFixture<SelectionModalDemoComponent>;
  }> {
    const fixture = TestBed.createComponent(SelectionModalDemoComponent);
    const openBtn = fixture.nativeElement.querySelector(
      '.selection-modal-demo-show-btn'
    );

    openBtn.click();
    fixture.detectChanges();

    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const harness = await rootLoader.getHarness(SkySelectionModalHarness);
    return { harness, fixture };
  }

  beforeEach(() => {
    // Create a mock search service. In a real-world application, the search
    // service would make a web request which should be avoided in unit tests.
    mockSvc = jasmine.createSpyObj('SelectionModalDemoService', ['search']);

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
      imports: [NoopAnimationsModule, SelectionModalDemoModule],
    });
  });

  it('should update the selected items list when an item is selected', async () => {
    const { harness, fixture } = await setupTest();

    await harness.enterSearchText('ra');
    await harness.selectSearchResult({
      contentText: 'Rachel',
    });
    await harness.saveAndClose();

    const selectedItemEls = fixture.nativeElement.querySelectorAll(
      '.selection-modal-demo-selected li'
    );

    expect(selectedItemEls).toHaveSize(1);
    expect(selectedItemEls[0].innerText.trim()).toBe('Rachel');
  });

  it('should not update the selected items list when the user cancels the selection modal', async () => {
    const { harness, fixture } = await setupTest();

    await harness.enterSearchText('ra');
    await harness.selectSearchResult({
      contentText: 'Rachel',
    });
    await harness.cancel();

    const selectedItemEls = fixture.nativeElement.querySelectorAll(
      '.selection-modal-demo-selected li'
    );

    expect(selectedItemEls).toHaveSize(0);
  });
});
