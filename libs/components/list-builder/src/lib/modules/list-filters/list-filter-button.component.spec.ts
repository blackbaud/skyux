import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { skip, take } from 'rxjs/operators';

import { SkyListToolbarModule } from '../list-toolbar/list-toolbar.module';
import { ListStateDispatcher } from '../list/state/list-state.rxstate';
import { ListState } from '../list/state/list-state.state-node';

import { ListFilterButtonTestComponent } from './fixtures/list-filter-button.component.fixture';
import { SkyListFiltersModule } from './list-filters.module';

describe('List filter button', () => {
  let state: ListState,
    dispatcher: ListStateDispatcher,
    fixture: ComponentFixture<ListFilterButtonTestComponent>,
    nativeElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    dispatcher = new ListStateDispatcher();
    state = new ListState(dispatcher);

    TestBed.configureTestingModule({
      declarations: [ListFilterButtonTestComponent],
      imports: [
        SkyListToolbarModule,
        SkyListFiltersModule],
      providers: [
        { provide: ListState, useValue: state },
        { provide: ListStateDispatcher, useValue: dispatcher }],
    });

    fixture = TestBed.createComponent(ListFilterButtonTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    state.pipe(skip(1), take(1)).subscribe(() => fixture.detectChanges());
  }));

  it('should place content in the appropriate area for the filter button', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(
        nativeElement.querySelector('.sky-toolbar-item .sky-test-content'),
      ).not.toBeNull();
    });
  }));
});
