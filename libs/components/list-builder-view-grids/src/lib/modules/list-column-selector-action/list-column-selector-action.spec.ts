import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  flush,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyGridModule } from '@skyux/grids';
import {
  ListState,
  ListStateDispatcher,
  SkyListComponent,
  SkyListModule,
  SkyListSecondaryActionsModule,
  SkyListToolbarModule,
} from '@skyux/list-builder';
import { SkyModalService } from '@skyux/modals';

import { skip, take } from 'rxjs/operators';

import { SkyListViewGridModule } from '../list-view-grid/list-view-grid.module';

import { ListColumnSelectorActionDeprecatedTestComponent } from './fixtures/list-column-selector-action-deprecated.component.fixture';
import { ListColumnSelectorActionTestComponent } from './fixtures/list-column-selector-action.component.fixture';

describe('List column selector action', () => {
  let fixture: ComponentFixture<any>;
  let nativeElement: HTMLElement;

  function getChooseColumnsButton() {
    let button = document.querySelector(
      '.sky-dropdown-menu button'
    ) as HTMLElement;
    if (!button) {
      button = nativeElement.querySelector(
        '[sky-cmp-id="column-chooser"] button'
      ) as HTMLElement;
    }
    return button;
  }

  function toggleSecondaryActionsDropdown() {
    fixture.detectChanges();
    flush();
    tick();
    fixture.detectChanges();

    const button = nativeElement.querySelector(
      '.sky-dropdown-button'
    ) as HTMLButtonElement;
    expect(button).toBeDefined();

    button.click();
    fixture.detectChanges();
    flush();
    tick();
    fixture.detectChanges();
  }

  function toggleSecondaryActionsDropdownAsync() {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const button = nativeElement.querySelector(
        '.sky-dropdown-button'
      ) as HTMLButtonElement;
      expect(button).toBeDefined();

      button.click();
      fixture.detectChanges();
    });
  }

  function getButtonEl() {
    return nativeElement.querySelector(
      '[sky-cmp-id="column-chooser"] .sky-btn'
    ) as HTMLButtonElement;
  }

  describe('toolbar button', () => {
    let state: ListState,
      dispatcher: ListStateDispatcher,
      component: ListColumnSelectorActionTestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ListColumnSelectorActionTestComponent],
        imports: [
          RouterTestingModule,
          SkyListModule,
          SkyListToolbarModule,
          SkyListSecondaryActionsModule,
          SkyGridModule,
          SkyListViewGridModule,
          NoopAnimationsModule,
        ],
      }).overrideComponent(SkyListComponent, {
        set: {
          providers: [ListState, ListStateDispatcher],
        },
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ListColumnSelectorActionTestComponent);
      component = fixture.componentInstance;
      nativeElement = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();

      const skyListDebugEl: DebugElement = fixture.debugElement.query(
        By.directive(SkyListComponent)
      );
      state = skyListDebugEl.injector.get(ListState);
      dispatcher = skyListDebugEl.injector.get(ListStateDispatcher);

      // always skip the first update to ListState, when state is ready
      // run detectChanges once more then begin tests
      state.pipe(skip(1), take(1)).subscribe(() => fixture.detectChanges());
      fixture.detectChanges();
    });

    afterEach(inject([SkyModalService], (_modalService: SkyModalService) => {
      _modalService.dispose();
      fixture.detectChanges();
    }));

    it('should not appear if not in grid view', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        dispatcher.viewsSetActive('other');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            expect(getButtonEl()).toBeNull();
          });
        });
      });
    }));

    it('should not clear the search text when new columns are set', async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component.searchText = 'something';

        const chooseColumnsButton = getButtonEl();
        chooseColumnsButton.click();
        fixture.detectChanges();

        const checkboxLabelEl = document.querySelectorAll(
          '.sky-modal .sky-list-view-checklist-item input'
        ) as NodeListOf<HTMLElement>;

        expect(checkboxLabelEl.length).toBe(2);

        checkboxLabelEl.item(0).click();
        fixture.detectChanges();

        const submitButtonEl = document.querySelector(
          '.sky-modal .sky-btn-primary'
        ) as HTMLButtonElement;

        submitButtonEl.click();
        fixture.detectChanges();

        component.grid.gridState.pipe(take(1)).subscribe((gridState) => {
          expect(gridState.displayedColumns.items.length).toBe(2);
          expect(component.searchText).toEqual('something');
        });
      });
    }));

    it('should show help button in modal header', async(() => {
      fixture.componentInstance.helpKey = 'foo.html';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const chooseColumnsButton = getChooseColumnsButton();
        chooseColumnsButton.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          const helpButton = document.querySelector(
            'button[name="help-button"]'
          );
          expect(helpButton).toExist();

          const cancelButtonEl = document.querySelector(
            '.sky-modal [sky-cmp-id="cancel"]'
          ) as HTMLButtonElement;
          cancelButtonEl.click();
          fixture.detectChanges();
        });
      });
    }));

    it('should emit help key when help button clicked', async(() => {
      const spy = spyOn(
        fixture.componentInstance,
        'onHelpOpened'
      ).and.callThrough();
      fixture.componentInstance.helpKey = 'foo.html';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const chooseColumnsButton = getChooseColumnsButton();
        chooseColumnsButton.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          fixture.detectChanges();

          const helpButton = document.querySelector(
            'button[name="help-button"]'
          );
          (helpButton as any).click();
          fixture.detectChanges();
          expect(spy).toHaveBeenCalledWith('foo.html');

          const cancelButtonEl = document.querySelector(
            '.sky-modal [sky-cmp-id="cancel"]'
          ) as HTMLButtonElement;
          cancelButtonEl.click();
          fixture.detectChanges();
        });
      });
    }));

    it('should pass accessibility', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });

  describe('dropdown', () => {
    let state: ListState,
      dispatcher: ListStateDispatcher,
      component: ListColumnSelectorActionDeprecatedTestComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ListColumnSelectorActionDeprecatedTestComponent],
        imports: [
          RouterTestingModule,
          SkyListModule,
          SkyListToolbarModule,
          SkyListSecondaryActionsModule,
          SkyGridModule,
          SkyListViewGridModule,
          NoopAnimationsModule,
        ],
      }).overrideComponent(SkyListComponent, {
        set: {
          providers: [ListStateDispatcher, ListState],
        },
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(
        ListColumnSelectorActionDeprecatedTestComponent
      );
      nativeElement = fixture.nativeElement as HTMLElement;
      component = fixture.componentInstance;

      const skyListDebugEl: DebugElement = fixture.debugElement.query(
        By.directive(SkyListComponent)
      );
      state = skyListDebugEl.injector.get(ListState);
      dispatcher = skyListDebugEl.injector.get(ListStateDispatcher);
    });

    afterEach(inject([SkyModalService], (_modalService: SkyModalService) => {
      _modalService.dispose();
      fixture.detectChanges();
    }));

    it('should show an action in the secondary actions dropdown', fakeAsync(() => {
      toggleSecondaryActionsDropdown();

      const chooseColumnsButton = getChooseColumnsButton();
      expect(chooseColumnsButton.textContent.trim()).toEqual('Choose columns');
    }));

    it('should open the appropriate modal on click and apply column changes on save', fakeAsync(() => {
      toggleSecondaryActionsDropdown();

      const chooseColumnsButton = getChooseColumnsButton();
      chooseColumnsButton.click();
      tick();

      const checkboxLabelEl = document.querySelectorAll(
        '.sky-modal .sky-list-view-checklist-item input'
      ) as NodeListOf<HTMLElement>;

      expect(checkboxLabelEl.length).toBe(2);

      checkboxLabelEl.item(0).click();
      tick();

      const submitButtonEl = document.querySelector(
        '.sky-modal .sky-btn-primary'
      ) as HTMLButtonElement;

      submitButtonEl.click();
      tick();

      component.grid.gridState.pipe(take(1)).subscribe((gridState) => {
        expect(gridState.displayedColumns.items.length).toBe(2);
      });

      flush();
      tick();
    }));

    it('should keep previous columns on cancel', fakeAsync(() => {
      toggleSecondaryActionsDropdown();

      const chooseColumnsButton = getChooseColumnsButton();
      chooseColumnsButton.click();
      fixture.detectChanges();
      tick();

      const checkboxLabelEl = document.querySelectorAll(
        '.sky-modal .sky-list-view-checklist-item input'
      ) as NodeListOf<HTMLElement>;

      checkboxLabelEl.item(0).click();
      fixture.detectChanges();
      tick();

      const cancelButtonEl = document.querySelector(
        '.sky-modal [sky-cmp-id="cancel"]'
      ) as HTMLButtonElement;
      cancelButtonEl.click();
      fixture.detectChanges();
      tick();

      component.grid.gridState.pipe(take(1)).subscribe((gridState) => {
        expect(gridState.displayedColumns.items.length).toBe(3);
      });

      flush();
      tick();
    }));

    it('should not appear if not in grid view', fakeAsync(() => {
      fixture.detectChanges();

      // Skip the first update to ListState, when state is ready.
      state.pipe(skip(1), take(1)).subscribe(() => {
        fixture.detectChanges();
        tick();
        dispatcher.viewsSetActive('other');
        tick();

        /* tslint:disable */
        const query =
          '.sky-list-toolbar-container .sky-toolbar-item .sky-list-secondary-actions .sky-dropdown .sky-dropdown-menu sky-list-secondary-action';
        /* tslint:enable */
        expect(nativeElement.querySelector(query)).toBeNull();
      });

      flush();
      tick();
    }));

    it('should pass accessibility', async () => {
      toggleSecondaryActionsDropdownAsync();

      await fixture.whenStable();
      fixture.detectChanges();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
