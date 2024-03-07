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

function clickDeleteButton(
  fixture: ComponentFixture<TestComponent>,
  index: number,
): void {
  const buttons = fixture.debugElement.queryAll(By.css('.test-btn'));
  buttons.at(index)?.nativeElement.click();
  fixture.detectChanges();
}

function getUserCount(fixture: ComponentFixture<TestComponent>): number {
  return fixture.debugElement.queryAll(By.css('.test-btn')).length;
}

describe('SkyConfirmTestingController', () => {
  let fixture: ComponentFixture<TestComponent>;
  let confirmController: SkyConfirmTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyConfirmTestingModule, TestComponent],
    });

    confirmController = TestBed.inject(SkyConfirmTestingController);
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should get the opened instance and its config', () => {
    fixture.detectChanges();

    clickDeleteButton(fixture, 0);

    const confirm = confirmController.expectOpen();

    expect(confirm.config).toEqual({
      message: 'Are you sure? This cannot be undone.',
    });

    expect(getUserCount(fixture)).toEqual(2);
    confirmController.ok();
    fixture.detectChanges();
    expect(getUserCount(fixture)).toEqual(1);
  });

  function verifyAction(action: string): void {
    fixture.detectChanges();

    clickDeleteButton(fixture, 0);

    confirmController.close({ action });
    confirmController.expectClosed();
  }

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
    const errorMessage =
      'A confirm instance is expected to be open but cannot be found.';

    fixture.detectChanges();

    expect(() => confirmController.expectOpen()).toThrowError(errorMessage);
    expect(() => confirmController.ok()).toThrowError(errorMessage);
    expect(() => confirmController.cancel()).toThrowError(errorMessage);
    expect(() => confirmController.close({ action: 'foobar' })).toThrowError(
      errorMessage,
    );
  });

  it('should throw if expecting an open confirm to be closed', () => {
    fixture.detectChanges();

    clickDeleteButton(fixture, 0);

    expect(() => confirmController.expectClosed()).toThrowError(
      'A confirm is open but is expected to be closed.',
    );
  });
});
