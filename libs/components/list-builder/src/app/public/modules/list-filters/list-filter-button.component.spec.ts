import {
  ListState,
  ListStateDispatcher
} from '../list/state';

import {
  TestBed,
  async,
  ComponentFixture
} from '@angular/core/testing';

import {
  ListFilterButtonTestComponent
} from './fixtures/list-filter-button.component.fixture';

import {
  SkyListToolbarModule
} from '../list-toolbar';

import {
  SkyListFiltersModule
} from '.';
describe('List filter button', () => {
  let state: ListState,
    dispatcher: ListStateDispatcher,
    fixture: ComponentFixture<ListFilterButtonTestComponent>,
    nativeElement: HTMLElement,
    component: ListFilterButtonTestComponent;

  beforeEach(async(() => {
    dispatcher = new ListStateDispatcher();
    state = new ListState(dispatcher);

    TestBed.configureTestingModule({
      declarations: [
        ListFilterButtonTestComponent
      ],
      imports: [
        SkyListToolbarModule,
        SkyListFiltersModule
      ],
      providers: [
        { provide: ListState, useValue: state },
        { provide: ListStateDispatcher, useValue: dispatcher }
      ]
    });

    fixture = TestBed.createComponent(ListFilterButtonTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
    state.skip(1).take(1).subscribe(() => fixture.detectChanges());
  }));

  it('should place content in the appropriate area for the filter button', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(nativeElement.querySelector('.sky-toolbar-item .sky-test-content')).not.toBeNull();
    });

  }));
});
