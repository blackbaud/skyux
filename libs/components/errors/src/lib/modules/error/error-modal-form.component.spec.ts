import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyModalConfiguration,
  SkyModalHostService,
  SkyModalInstance,
  SkyModalModule,
} from '@skyux/modals';

import { ErrorModalConfig } from './error-modal-config';
import { SkyErrorModalFormComponent } from './error-modal-form.component';
import { SkyErrorModule } from './error.module';
import { MockHostService, SkyModalInstanceMock } from './fixtures/mocks';

describe('Error modal form component', () => {
  const config: ErrorModalConfig = {
    errorTitle: 'Some error title',
    errorDescription: 'Description of error',
    errorCloseText: 'Close button text',
  };

  const modalInstance = new SkyModalInstanceMock();
  const mockHost = new MockHostService();
  let fixture: ComponentFixture<SkyErrorModalFormComponent>;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyModalModule, SkyErrorModule],
      providers: [
        { provide: ErrorModalConfig, useValue: config },
        { provide: SkyModalInstance, useValue: modalInstance },
        { provide: SkyModalHostService, useValue: mockHost },
        { provide: SkyModalConfiguration, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(SkyErrorModalFormComponent);
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('Title, description, and button text are displayed', () => {
    // check text
    const titleEl = el.querySelector('.sky-error-modal-title');
    const description = el.querySelector('.sky-error-modal-description');
    const buttonEl = el.querySelector('.sky-error-modal-close button');

    expect(titleEl).toExist();
    expect(description).toExist();
    expect(buttonEl).toExist();

    expect(titleEl).toHaveText('Some error title');
    expect(description).toHaveText('Description of error');
    expect(buttonEl).toHaveText('Close button text');
  });

  it('clicking close button invokes close method', () => {
    // test close method is called when clicked
    spyOn(modalInstance, 'close');
    const closeButtonEl = el.querySelector(
      '.sky-error-modal-close button',
    ) as HTMLElement;
    closeButtonEl.click();
    expect(modalInstance.close).toHaveBeenCalled();
  });

  it('should pass accessibility', async () => {
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
