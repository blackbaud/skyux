import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ListState,
  ListStateDispatcher
} from '../list/state';

import {
  ListViewSwitcherFixtureComponent
} from './fixtures/list-view-switcher.component.fixture';

import {
  ListViewSwitcherOnlyGridFixtureComponent
} from './fixtures/list-view-switcher-only-grid.component.fixture';

import {
  ListViewSwitcherOnlyCustomFixtureComponent
} from './fixtures/list-view-switcher-only-custom.component.fixture';

import {
  ListViewSwitcherExtraCustomFixtureComponent
} from './fixtures/list-view-switcher-extra-custom.component.fixture';

import {
  SkySummaryActionBarFixtureModule
} from './fixtures/list-view-switcher.module.fixture';

describe('List View Switcher Component', () => {
  let state: ListState,
    dispatcher: ListStateDispatcher,
    nativeElement: HTMLElement,
    mockMediaQueryService: MockSkyMediaQueryService;

  describe('multi-view', () => {

    let fixture: ComponentFixture<ListViewSwitcherFixtureComponent>,
      component: ListViewSwitcherFixtureComponent;

    beforeEach(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);
      mockMediaQueryService = new MockSkyMediaQueryService();

      TestBed.configureTestingModule({
        imports: [
          SkySummaryActionBarFixtureModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher },
          { provide: SkyMediaQueryService, useValue: mockMediaQueryService }
        ]
      });

      fixture = TestBed.createComponent(ListViewSwitcherFixtureComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;
    });

    describe('normal view', () => {

      it('should show the view switcher if more than one view exists', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(nativeElement.querySelector('sky-list-view-switcher sky-radio-group'))
          .not.toBeNull();
      }));

      it('should not show the view if their is no custom button defined for a custom view',
        fakeAsync(() => {
          component.showCustomSwitcherButton = false;
          fixture.detectChanges();
          tick();
          expect(nativeElement.querySelector('sky-list-view-switcher sky-radio-group'))
            .toBeNull();
          component.showCustomSwitcherButton = true;
          fixture.detectChanges();
          tick();
          expect(nativeElement.querySelector('sky-list-view-switcher sky-radio-group'))
            .not.toBeNull();
        }));

      it('should set the default radio button for a grid correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        const gridRadio: HTMLElement = <HTMLElement>nativeElement
          .querySelector('sky-list-view-switcher sky-radio[ng-reflect-icon="table"]');
        expect(gridRadio).not.toBeNull();
        expect(gridRadio.querySelector('i.fa-table')).not.toBeNull();
      }));

      it('should set the custom radio button correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        const gridRadio: HTMLElement = <HTMLElement>nativeElement
          .querySelector('sky-list-view-switcher sky-radio[ng-reflect-icon="gavel"]');
        expect(gridRadio).not.toBeNull();
        expect(gridRadio.querySelector('i.fa-gavel')).not.toBeNull();
      }));

      it('should set the list to the default view', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          component.gridView.active.subscribe(activeState => {
            expect(activeState).toBeFalsy();
          });
          component.secondaryView.active.subscribe(activeState => {
            expect(activeState).toBeTruthy();
          });
        });
      }));

      it('should not change view when activated view is clicked', () => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          (<HTMLElement>nativeElement
            .querySelector('sky-list-view-switcher sky-radio[ng-reflect-icon="gavel"]'))
            .click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            component.gridView.active.subscribe(activeState => {
              expect(activeState).toBeFalsy();
            });
            component.secondaryView.active.subscribe(activeState => {
              expect(activeState).toBeTruthy();
            });
          });
        });
      });

      it('should switch to the grid view correctly', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          (<HTMLElement>nativeElement
            .querySelector('sky-list-view-switcher sky-radio[ng-reflect-icon="table"]'))
            .click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            component.gridView.active.subscribe(activeState => {
              expect(activeState).toBeTruthy();
            });
            component.secondaryView.active.subscribe(activeState => {
              expect(activeState).toBeFalsy();
            });
          });
        });
      }));

      it('should be accessible', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(nativeElement).toBeAccessible();
        });
      }));

    });

    describe('mobile view', () => {

      beforeEach(() => {
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
      });

      it('should show the view switcher if more than one view exists', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(nativeElement.querySelector('sky-list-view-switcher sky-dropdown'))
          .not.toBeNull();
      }));

      it('should set the dropdown button for a grid correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        (<HTMLElement>document.querySelector('sky-list-view-switcher .sky-dropdown-button'))
          .click();
        fixture.detectChanges();
        tick();
        const gridDropdownButton: HTMLElement =
          <HTMLElement>document
            .querySelector('sky-dropdown-item sky-icon[ng-reflect-icon="table"]');
        expect(gridDropdownButton).not.toBeNull();
        expect(gridDropdownButton.querySelector('i.fa-table')).not.toBeNull();
      }));

      it('should set the custom dropdown button correctly', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        (<HTMLElement>document.querySelector('sky-list-view-switcher .sky-dropdown-button'))
          .click();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();
        const customDropdownButton: HTMLElement =
          <HTMLElement>document
            .querySelector('sky-dropdown-item sky-icon[ng-reflect-icon="gavel"]');
        expect(customDropdownButton).not.toBeNull();
        expect(customDropdownButton.querySelector('i.fa-gavel')).not.toBeNull();
      }));

      it('should set the list to the default view', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          component.gridView.active.subscribe(activeState => {
            expect(activeState).toBeFalsy();
          });
          component.secondaryView.active.subscribe(activeState => {
            expect(activeState).toBeTruthy();
          });
        });
      }));

      it('should switch to the grid view correctly', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          (<HTMLElement>document.querySelector('sky-list-view-switcher .sky-dropdown-button'))
            .click();
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            (<HTMLElement>document
              .querySelectorAll('sky-dropdown-item button')[0])
              .click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
              component.gridView.active.subscribe(activeState => {
                expect(activeState).toBeTruthy();
              });
              component.secondaryView.active.subscribe(activeState => {
                expect(activeState).toBeFalsy();
              });
            });
          });
        });
      }));

      it('should be accessible', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(nativeElement).toBeAccessible();
        });
      }));

    });

  });

  describe('grid only', () => {

    let fixture: ComponentFixture<ListViewSwitcherOnlyGridFixtureComponent>;

    beforeEach(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);
      mockMediaQueryService = new MockSkyMediaQueryService();

      TestBed.configureTestingModule({
        imports: [
          SkySummaryActionBarFixtureModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher },
          { provide: SkyMediaQueryService, useValue: mockMediaQueryService }
        ]
      });

      fixture = TestBed.createComponent(ListViewSwitcherOnlyGridFixtureComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
    });

    describe('normal view', () => {

      it('should not show the view switcher if only a default view exists', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(nativeElement.querySelector('sky-list-view-switcher sky-radio-group'))
          .toBeNull();
      }));

    });

    describe('mobile view', () => {

      beforeEach(() => {
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
      });

      it('should not show the view switcher if only a default view exists', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(nativeElement.querySelector('sky-list-view-switcher sky-dropdown'))
          .toBeNull();
      }));

    });

  });

  describe('custom only', () => {

    let fixture: ComponentFixture<ListViewSwitcherOnlyCustomFixtureComponent>;

    beforeEach(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);
      mockMediaQueryService = new MockSkyMediaQueryService();

      TestBed.configureTestingModule({
        imports: [
          SkySummaryActionBarFixtureModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher },
          { provide: SkyMediaQueryService, useValue: mockMediaQueryService }
        ]
      });

      fixture = TestBed.createComponent(ListViewSwitcherOnlyCustomFixtureComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
    });

    describe('normal view', () => {

      it('should not show the view switcher if only one custom view exists', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(nativeElement.querySelector('sky-list-view-switcher sky-radio-group'))
          .toBeNull();
      }));

    });

    describe('mobile view', () => {

      beforeEach(() => {
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
      });

      it('should not show the view switcher if only a default view exists', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(nativeElement.querySelector('sky-list-view-switcher sky-dropdown'))
          .toBeNull();
      }));

    });

  });

  describe('custom only with extra declaration', () => {

    let fixture: ComponentFixture<ListViewSwitcherExtraCustomFixtureComponent>;

    beforeEach(() => {
      dispatcher = new ListStateDispatcher();
      state = new ListState(dispatcher);
      mockMediaQueryService = new MockSkyMediaQueryService();

      TestBed.configureTestingModule({
        imports: [
          SkySummaryActionBarFixtureModule
        ],
        providers: [
          { provide: ListState, useValue: state },
          { provide: ListStateDispatcher, useValue: dispatcher },
          { provide: SkyMediaQueryService, useValue: mockMediaQueryService }
        ]
      });

      fixture = TestBed.createComponent(ListViewSwitcherExtraCustomFixtureComponent);
      nativeElement = fixture.nativeElement as HTMLElement;
    });

    describe('normal view', () => {

      it('should not show the view switcher if only one view and an extra custom declaration exists',
        fakeAsync(() => {
          fixture.detectChanges();
          tick();
          expect(nativeElement.querySelector('sky-list-view-switcher sky-radio-group'))
            .toBeNull();
        }));

    });

    describe('mobile view', () => {

      beforeEach(() => {
        mockMediaQueryService.fire(SkyMediaBreakpoints.xs);
      });

      it('should not show the view switcher if only a default view exists', fakeAsync(() => {
        fixture.detectChanges();
        tick();
        expect(nativeElement.querySelector('sky-list-view-switcher sky-dropdown'))
          .toBeNull();
      }));

    });

  });

});
