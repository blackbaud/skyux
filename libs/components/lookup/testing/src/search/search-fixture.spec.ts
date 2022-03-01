import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkySearchFixture } from './search-fixture';
import { SkySearchTestingModule } from './search-testing.module';

//#region Test component
@Component({
  selector: 'search-test',
  template: `
    <sky-search
      [placeholderText]="placeholderText"
      [searchText]="searchText"
      (searchApply)="searchApplied($event)"
      (searchClear)="searchCleared()"
      data-sky-id="test-search"
    >
    </sky-search>
  `,
})
class TestComponent {
  public placeholderText = 'Search placeholder text';

  public searchText = 'Search test text';

  public searchApplied(query: string) {}

  public searchCleared() {}
}
//#endregion Test component

describe('Search fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [NoopAnimationsModule, SkySearchTestingModule],
    });
  });

  it('should expose the expected properties', async () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    await fixture.whenStable();
    const search = new SkySearchFixture(fixture, 'test-search');

    expect(search.placeholderText).toBe('Search placeholder text');
    expect(search.searchText).toBe('Search test text');
  });

  it('should provide a method to apply the search text', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const search = new SkySearchFixture(fixture, 'test-search');

    const searchAppliedSpy = spyOn(fixture.componentInstance, 'searchApplied');

    search.apply();

    expect(searchAppliedSpy).toHaveBeenCalledWith('Search test text');

    search.apply('New text');

    expect(searchAppliedSpy).toHaveBeenCalledWith('New text');
  });

  it('should provide a method to clear the search text', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const search = new SkySearchFixture(fixture, 'test-search');

    const searchAppliedSpy = spyOn(fixture.componentInstance, 'searchApplied');
    const searchClearedSpy = spyOn(fixture.componentInstance, 'searchCleared');

    search.clear();

    fixture.detectChanges();

    expect(searchClearedSpy).toHaveBeenCalled();
    expect(searchAppliedSpy).toHaveBeenCalledWith('');

    expect(() => {
      search.clear();
    }).toThrowError(
      'There currently is no search text or the current search text has not been applied, ' +
        'so the clear button is not visible.'
    );
  });
});
