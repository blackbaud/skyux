import {
  fakeAsync,
  inject,
  tick,
  TestBed,
  ComponentFixture,
  async
} from '@angular/core/testing';
import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  expect
} from '@blackbaud/skyux-builder/runtime/testing/browser';

import {
  SkyModalService,
  SkyModalModule
} from '@skyux/modals';

import {
  ColumnSelectorTestComponent
} from './fixtures/column-selector-modal.component.fixture';
import {
  SkyColumnSelectorModule
} from './column-selector-modal.module';

describe('Column selector component', () => {
  let fixture: ComponentFixture<ColumnSelectorTestComponent>;
  let component: ColumnSelectorTestComponent;
  let nativeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ColumnSelectorTestComponent
      ],
      imports: [
        RouterTestingModule,
        SkyColumnSelectorModule,
        SkyModalModule
      ]
    });

    fixture = TestBed.createComponent(ColumnSelectorTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  afterEach(
    inject(
      [
        SkyModalService
      ],
      (
        _modalService: SkyModalService
      ) => {
        _modalService.dispose();
        fixture.detectChanges();
      }
    )
  );

  it('should render a checklist with column headers and descriptions', fakeAsync(() => {

    nativeElement.querySelector('button').click();
    fixture.detectChanges();
    tick();
    let checklistItemQuery = '.sky-modal .sky-list-view-checklist-item sky-checkbox-label';

    expect(document.body.querySelector(checklistItemQuery).querySelector('.sky-emphasized'))
      .toHaveText('Column 1');

    expect(document.body.querySelector(checklistItemQuery).querySelectorAll('div')[1])
      .toHaveText('Column 1 desc');

    let closeButton = document.body.querySelector('.sky-modal-btn-close') as HTMLButtonElement;
    closeButton.click();

    fixture.detectChanges();
    tick();
    expect(component.selectedColumnIds).toEqual([
      '1',
      '2',
      '3'
    ]);

  }));

  it('should save appropriate data when save clicked', fakeAsync(() => {
    nativeElement.querySelector('button').click();
    fixture.detectChanges();

    tick();

    let checkboxLabelEl =
      document.querySelector('.sky-modal .sky-list-view-checklist-item input') as HTMLElement;
    checkboxLabelEl.click();

    tick();
    fixture.detectChanges();

    let submitButtonEl =
      document.querySelector('.sky-modal .sky-btn-primary') as HTMLButtonElement;

    submitButtonEl.click();
    fixture.detectChanges();
    tick();
    expect(component.selectedColumnIds).toEqual([
      '2',
      '3'
    ]);
  }));

  it('should close with appropriate no data when cancel clicked', fakeAsync(() => {
    nativeElement.querySelector('button').click();
    fixture.detectChanges();

    tick();

    let checkboxLabelEl =
      document.querySelector('.sky-modal .sky-list-view-checklist-item input') as HTMLElement;
    checkboxLabelEl.click();

    tick();
    fixture.detectChanges();

    let cancelButtonEl =
      document.querySelector('.sky-modal [sky-cmp-id="cancel"]') as HTMLButtonElement;

    cancelButtonEl.click();
    fixture.detectChanges();
    tick();
    expect(component.selectedColumnIds).toEqual([
      '1',
      '2',
      '3'
    ]);
  }));

  it('should pass accessibility', async(() => {
    nativeElement.querySelector('button').click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
