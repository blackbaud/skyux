import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ListState,
  ListStateDispatcher
} from '../list/state';
import {
  SkyListToolbarModule
} from '../list-toolbar';

import {
  ListSecondaryActionsTestComponent
} from './fixtures/list-secondary-actions.component.fixture';
import {
  SkyListSecondaryActionsModule
} from './list-secondary-actions.module';

describe('List Secondary Actions Component', () => {
  let state: ListState;
  let dispatcher: ListStateDispatcher;
  let fixture: ComponentFixture<ListSecondaryActionsTestComponent>;
  let nativeElement: HTMLElement;
  let component: ListSecondaryActionsTestComponent;

  beforeEach(() => {
    dispatcher = new ListStateDispatcher();
    state = new ListState(dispatcher);

    TestBed.configureTestingModule({
      declarations: [
        ListSecondaryActionsTestComponent
      ],
      imports: [
        SkyListToolbarModule,
        SkyListSecondaryActionsModule
      ],
      providers: [
        { provide: ListState, useValue: state },
        { provide: ListStateDispatcher, useValue: dispatcher }
      ]
    });

    fixture = TestBed.createComponent(ListSecondaryActionsTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should show secondary actions when specified', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const query = '.sky-list-secondary-actions .sky-dropdown-item';
      expect(nativeElement.querySelector(query)).not.toBeNull();
    });
  }));

  it('should hide secondary actions when no child actions available', fakeAsync(() => {
    component.showOption = false;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(nativeElement.querySelector('.sky-list-secondary-actions-hidden')).not.toBeNull();

    component.showOption = true;
    fixture.detectChanges();
    tick();

    expect(nativeElement.querySelector('.sky-list-secondary-actions-hidden')).toBeNull();
  }));
});
