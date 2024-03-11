/* eslint-disable @nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyConfirmService } from '@skyux/modals';

import { SkyConfirmTestingController } from './confirm-testing.controller';
import { SkyConfirmTestingModule } from './confirm-testing.module';

interface User {
  firstName: string;
}

@Component({
  imports: [CommonModule],
  standalone: true,
  template: `
    <div *ngFor="let user of users" class="test-item">
      <span>{{ user.firstName }}</span>
      <button class="test-btn" type="button" (click)="onClick(user)">
        Delete
      </button>
    </div>
  `,
})
class TestComponent {
  protected users: User[] = [
    {
      firstName: 'Michael',
    },
    {
      firstName: 'Jan',
    },
  ];

  readonly #confirmSvc = inject(SkyConfirmService);

  protected onClick(user: User): void {
    const dialog = this.#confirmSvc.open({
      message: 'Are you sure? This cannot be undone.',
    });

    dialog.closed.subscribe((args) => {
      if (args.action === 'ok') {
        this.users.splice(this.users.indexOf(user), 1);
      }
    });
  }
}

function launchDeleteConfirmation(
  fixture: ComponentFixture<TestComponent>,
): void {
  const buttons = fixture.debugElement.queryAll(By.css('.test-btn'));
  buttons.at(0)?.nativeElement.click();
  fixture.detectChanges();
}

function getUserCount(fixture: ComponentFixture<TestComponent>): number {
  return fixture.debugElement.queryAll(By.css('.test-btn')).length;
}

describe('Confirm demo using testing controller', () => {
  function setupTest(): {
    confirmController: SkyConfirmTestingController;
    fixture: ComponentFixture<TestComponent>;
  } {
    const confirmController = TestBed.inject(SkyConfirmTestingController);
    const fixture = TestBed.createComponent(TestComponent);

    return { confirmController, fixture };
  }

  function verifyAction(action: string): void {
    const { confirmController, fixture } = setupTest();

    fixture.detectChanges();
    launchDeleteConfirmation(fixture);

    confirmController.close({ action });
    confirmController.expectNone();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyConfirmTestingModule, TestComponent],
    });
  });

  it('should assert confirm is open', () => {
    const { confirmController, fixture } = setupTest();

    fixture.detectChanges();
    launchDeleteConfirmation(fixture);

    confirmController.expectOpen({
      message: 'Are you sure? This cannot be undone.',
    });

    expect(getUserCount(fixture)).toEqual(2);
    confirmController.ok();
    fixture.detectChanges();
    expect(getUserCount(fixture)).toEqual(1);
  });

  it('should close the confirm with "ok" action', () => {
    verifyAction('ok');
  });

  it('should close the confirm with "cancel" action', () => {
    verifyAction('cancel');
  });

  it('should close the confirm with custom action', () => {
    verifyAction('custom-foobar');
  });

  it('should throw if closing a non-existent confirm', () => {
    const { confirmController, fixture } = setupTest();

    const errorMessage =
      'A confirm dialog is expected to be open but is closed.';

    fixture.detectChanges();

    expect(() => confirmController.ok()).toThrowError(errorMessage);
    expect(() => confirmController.cancel()).toThrowError(errorMessage);
    expect(() => confirmController.close({ action: 'foobar' })).toThrowError(
      errorMessage,
    );
  });

  it('should throw if expecting a confirm to be open with differing config', async () => {
    const { confirmController, fixture } = setupTest();

    fixture.detectChanges();
    launchDeleteConfirmation(fixture);

    expect(() => confirmController.expectOpen({ message: 'invalid' }))
      .toThrowError(`Expected a confirm dialog to be open with a specific configuration.
Expected:
{
  "message": "invalid"
}
Actual:
{
  "message": "Are you sure? This cannot be undone."
}
`);
  });

  it('should throw if expecting an open confirm to be closed', () => {
    const { confirmController, fixture } = setupTest();

    fixture.detectChanges();
    launchDeleteConfirmation(fixture);

    expect(() => confirmController.expectNone()).toThrowError(
      'A confirm dialog is expected to be closed but is open.',
    );
  });
});
