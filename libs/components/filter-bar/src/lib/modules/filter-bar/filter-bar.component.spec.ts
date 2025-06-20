import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SkyFilterBarTestComponent } from './fixtures/filter-bar.component.fixture';

describe('Filter bar component', () => {
  //#region helpers

  function getFilterPickerButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector(
      '.sky-btn.sky-btn-icon.sky-filter-bar-btn',
    );
  }

  function getModalSaveButton(): HTMLButtonElement | null {
    return document.querySelector('.sky-lookup-show-more-modal-save');
  }

  //#endregion

  let component: SkyFilterBarTestComponent;
  let fixture: ComponentFixture<SkyFilterBarTestComponent>;
  // let modalController: SkyModalTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyFilterBarTestComponent /* , SkyModalTestingModule */],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyFilterBarTestComponent);
    component = fixture.componentInstance;

    // modalController = TestBed.inject(SkyModalTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the selection modal when selected', () => {
    const filterPickerButton = getFilterPickerButton();

    expect(filterPickerButton).toBeTruthy();

    filterPickerButton?.click();

    fixture.detectChanges();

    const closeButton = getModalSaveButton();

    closeButton?.click();
  });

  it('should not have a selection modal button if no search function is specified', () => {
    component.searchFn = undefined;

    fixture.detectChanges();

    const filterPickerButton = getFilterPickerButton();

    expect(filterPickerButton).toBeNull();
  });
});
