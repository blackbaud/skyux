import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  SkyModalInstance,
  SkyModalModule,
  SkyModalService,
} from '@skyux/modals';
import { SkyThemeService } from '@skyux/theme';

import { ModalMockThemeService } from './mock-theme.service';
import { SkyModalFixture } from './modal-fixture';

//#region Test component
@Component({
  selector: 'sky-modal-test',
  template: `
    <sky-modal
      data-sky-id="test-modal"
      [ngClass]="{ 'sky-theme-modern': fakeModern }"
    >
      <sky-modal-header> Test Title </sky-modal-header>
      <sky-modal-content>
        <div class="test-class" id="test-modal-content-1">
          This modal can have content!
        </div>
      </sky-modal-content>
      <sky-modal-footer>
        <button
          class="sky-btn sky-btn-primary"
          id="test-modal-button"
          type="button"
        >
          Close
        </button>
      </sky-modal-footer>
    </sky-modal>

    <!-- This span is important to test the querySelectorAll function -->
    <span class="test-class" id="test-modal-content-2">
      Non-modal content
    </span>
  `,
  standalone: false,
})
class TestModalComponent {
  public fakeModern = false;
}

@Component({
  selector: 'sky-modal-test',
  template: `
    <button
      class="sky-btn sky-btn-primary"
      id="test-launch-button"
      type="button"
      (click)="launchModal()"
    >
      Launch modal
    </button>
  `,
  standalone: false,
})
class TestComponent {
  public ariaDescribedBy: string | undefined;

  public ariaLabelledBy: string | undefined;

  public ariaRole: string | undefined;

  public fakeModern = false;

  public fullPage: boolean | undefined;

  public helpKey: string | undefined;

  public size: string | undefined;

  public tiledBody: boolean | undefined;

  #modalInstance: SkyModalInstance | undefined;

  #modalService: SkyModalService;

  constructor(modalService: SkyModalService) {
    this.#modalService = modalService;
  }

  public launchModal() {
    this.#modalInstance = this.#modalService.open(TestModalComponent, {
      ariaDescribedBy: this.ariaDescribedBy,
      ariaLabelledBy: this.ariaLabelledBy,
      ariaRole: this.ariaRole,
      helpKey: this.helpKey,
      size: this.size,
      fullPage: this.fullPage,
      tiledBody: this.tiledBody,
    });

    this.#modalInstance.componentInstance.fakeModern = this.fakeModern;
    this.#modalInstance.helpOpened.subscribe((key: string) => {
      this.helpTriggered(key);
    });
  }

  public closeModal() {
    this.#modalInstance?.close();
  }

  public helpTriggered(key: string) {
    return;
  }
}

@NgModule({
  declarations: [TestComponent, TestModalComponent],
  imports: [CommonModule, RouterTestingModule, SkyModalModule],
  providers: [
    {
      provide: SkyThemeService,
      useClass: ModalMockThemeService,
    },
  ],
})
class TestModule {}

//#endregion Test component

describe('Modal fixture', () => {
  function launchTestModal(): SkyModalFixture {
    fixture.componentInstance.launchModal();

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const modal = new SkyModalFixture(fixture, 'test-modal');

    fixture.detectChanges();
    return modal;
  }

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should throw an error if the fixture is created with no correct identifier', fakeAsync(() => {
    expect(() => new SkyModalFixture(fixture, 'test-modal')).toThrowError();
  }));

  it('should return the `ariaDescribedBy` property correctly', fakeAsync(() => {
    fixture.componentInstance.ariaDescribedBy = 'describingID';
    const modal = launchTestModal();

    expect(modal.ariaDescribedBy).toBe('describingID');
  }));

  it('should error if the modal has been closed when `ariaDescribedBy` is requested', fakeAsync(() => {
    fixture.componentInstance.ariaDescribedBy = 'describingID';
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.ariaDescribedBy).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should return the `ariaLabelledBy` property correctly', fakeAsync(() => {
    fixture.componentInstance.ariaLabelledBy = 'labellingID';
    const modal = launchTestModal();

    expect(modal.ariaLabelledBy).toBe('labellingID');
  }));

  it('should error if the modal has been closed when `ariaLabelledBy` is requested', fakeAsync(() => {
    fixture.componentInstance.ariaLabelledBy = 'labellingID';
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.ariaLabelledBy).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should return the `ariaRole` property correctly', fakeAsync(() => {
    fixture.componentInstance.ariaRole = 'modalRole';
    const modal = launchTestModal();

    expect(modal.ariaRole).toBe('modalRole');
  }));

  it('should error if the modal has been closed when `ariaRole` is requested', fakeAsync(() => {
    fixture.componentInstance.ariaRole = 'modalRole';
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.ariaRole).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should return the `fullPage` property correctly', fakeAsync(() => {
    fixture.componentInstance.fullPage = true;
    const modal = launchTestModal();

    expect(modal.fullPage).toBeTruthy();
    expect(modal.size).toBeUndefined();
  }));

  it('should error if the modal has been closed when `fullPage` is requested', fakeAsync(() => {
    fixture.componentInstance.fullPage = true;
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.fullPage).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should return the `size` property correctly', fakeAsync(() => {
    fixture.componentInstance.size = 'small';
    const modal = launchTestModal();

    expect(modal.fullPage).toBeFalse();
    expect(modal.size).toBe('small');
  }));

  it('should error if the modal has been closed when `size` is requested', fakeAsync(() => {
    fixture.componentInstance.size = 'small';
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.size).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should return the `tiledBody` property correctly', fakeAsync(() => {
    fixture.componentInstance.tiledBody = true;
    const modal = launchTestModal();

    expect(modal.tiledBody).toBeTrue();
  }));

  it('should error if the modal has been closed when `tiledBody` is requested', fakeAsync(() => {
    fixture.componentInstance.tiledBody = true;
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.tiledBody).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should close the modal when the close button click is triggered', fakeAsync(() => {
    const modal = launchTestModal();

    modal.clickHeaderCloseButton();

    expect(
      document.querySelector('sky-modal[data-sky-id="test-modal"]'),
    ).toBeNull();
  }));

  it('should error if the modal has been closed when `clickHeaderCloseButton` is called', fakeAsync(() => {
    const modal = launchTestModal();

    fixture.componentInstance.closeModal();

    expect(() => modal.clickHeaderCloseButton()).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should error if the close button does not exist when `clickHeaderCloseButton` is called', fakeAsync(() => {
    fixture.componentInstance.fakeModern = true;
    const modal = launchTestModal();

    expect(() => modal.clickHeaderCloseButton()).toThrowError(
      'No header close button exists.',
    );
  }));

  it('should click the help button correctly when it is triggered', fakeAsync(() => {
    fixture.componentInstance.helpKey = 'test-key';
    const modal = launchTestModal();

    spyOn(fixture.componentInstance, 'helpTriggered').and.callThrough();

    modal.clickHelpButton();

    fixture.detectChanges();

    expect(fixture.componentInstance.helpTriggered).toHaveBeenCalledWith(
      'test-key',
    );
  }));

  it('should error if the modal has been closed when `clickHelpButton` is called', fakeAsync(() => {
    fixture.componentInstance.helpKey = 'test-key';
    const modal = launchTestModal();

    fixture.componentInstance.closeModal();

    expect(() => modal.clickHelpButton()).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should error if the help button does not exist (no help key) when `clickHelpButton` is called', fakeAsync(() => {
    const modal = launchTestModal();

    expect(() => modal.clickHelpButton()).toThrowError(
      'No help button exists.',
    );
  }));

  it('should error if the help button does not exist (modern theme) when `clickHelpButton` is called', fakeAsync(() => {
    fixture.componentInstance.fakeModern = true;
    fixture.componentInstance.helpKey = 'test-key';
    const modal = launchTestModal();

    expect(() => modal.clickHelpButton()).toThrowError(
      'No help button exists.',
    );
  }));

  it('should select the correct element when calling `getModalDiv`', fakeAsync(() => {
    const modal = launchTestModal();

    const queriedElement = modal.getModalDiv();
    expect(queriedElement).not.toBeNull();
    expect(queriedElement.tagName.toLowerCase()).toBe('div');
    expect(queriedElement.classList).toContain('sky-modal');
  }));

  it('should error if the modal has been closed when `getModalDiv` is requested', fakeAsync(() => {
    fixture.componentInstance.tiledBody = true;
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.getModalDiv()).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should select the correct element when calling `getModalContentEl`', fakeAsync(() => {
    const modal = launchTestModal();

    const queriedElement = modal.getModalContentEl();
    expect(queriedElement).not.toBeNull();
    expect(queriedElement.tagName.toLowerCase()).toBe('div');
    expect(queriedElement.classList).toContain('sky-modal-content');
  }));

  it('should error if the modal has been closed when `getModalContentEl` is requested', fakeAsync(() => {
    fixture.componentInstance.tiledBody = true;
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.getModalContentEl()).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should select the correct element when calling `getModalHeaderEl`', fakeAsync(() => {
    const modal = launchTestModal();

    const queriedElement = modal.getModalHeaderEl();
    expect(queriedElement).not.toBeNull();
    expect(queriedElement.tagName.toLowerCase()).toBe('div');
    expect(queriedElement.classList).toContain('sky-modal-header');
  }));

  it('should error if the modal has been closed when `getModalHeaderEl` is requested', fakeAsync(() => {
    fixture.componentInstance.tiledBody = true;
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.getModalHeaderEl()).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));

  it('should select the correct element when calling `getModalFooterEl`', fakeAsync(() => {
    const modal = launchTestModal();

    const queriedElement = modal.getModalFooterEl();
    expect(queriedElement).not.toBeNull();
    expect(queriedElement.tagName.toLowerCase()).toBe('div');
    expect(queriedElement.classList).toContain('sky-modal-footer');
  }));

  it('should error if the modal has been closed when `getModalFooterEl` is requested', fakeAsync(() => {
    fixture.componentInstance.tiledBody = true;
    const modal = launchTestModal();
    fixture.componentInstance.closeModal();
    fixture.detectChanges();

    expect(() => modal.getModalFooterEl()).toThrowError(
      'Modal element no longer exists. Was the modal closed?',
    );
  }));
});
