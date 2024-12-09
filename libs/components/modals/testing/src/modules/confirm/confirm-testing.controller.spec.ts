import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';

import { SkyConfirmTestingController } from './confirm-testing.controller';
import { SkyConfirmTestingModule } from './confirm-testing.module';

interface User {
  firstName: string;
}

@Component({
  standalone: true,
  template: `
    @for (user of users; track user.firstName) {
      <div class="test-item">
        <span>{{ user.firstName }}</span>
        <button class="test-btn" type="button" (click)="onClick(user)">
          Delete
        </button>
        <button
          class="test-btn-custom"
          type="button"
          (click)="onClickCustom(user)"
        >
          Delete (Custom)
        </button>
      </div>
    }
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

  protected onClickCustom(user: User): void {
    const dialog = this.#confirmSvc.open({
      message: 'Are you sure? This cannot be undone.',
      type: SkyConfirmType.Custom,
      buttons: [
        {
          action: 'yes',
          text: 'Yes',
        },
        {
          action: 'no',
          text: 'No',
        },
      ],
    });

    dialog.closed.subscribe((args) => {
      if (args.action === 'yes') {
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

function launchCustomDeleteConfirmation(
  fixture: ComponentFixture<TestComponent>,
): void {
  const buttons = fixture.debugElement.queryAll(By.css('.test-btn-custom'));
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

  it('should assert confirm is open with custom buttons', () => {
    const { confirmController, fixture } = setupTest();

    fixture.detectChanges();
    launchCustomDeleteConfirmation(fixture);

    confirmController.expectOpen({
      message: 'Are you sure? This cannot be undone.',
      type: SkyConfirmType.Custom,
      buttons: [
        {
          action: 'yes',
          text: 'Yes',
        },
        {
          action: 'no',
          text: 'No',
        },
      ],
    });

    expect(getUserCount(fixture)).toEqual(2);
    confirmController.close({ action: 'yes' });
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
    const confirmSvc = TestBed.inject(SkyConfirmService);

    confirmSvc.open({
      message: 'Are you sure?',
      type: SkyConfirmType.Custom,
      buttons: [{ action: 'foobar', text: 'Foobar!' }],
    });

    const confirmController = TestBed.inject(SkyConfirmTestingController);
    confirmController.close({ action: 'foobar' });
    confirmController.expectNone();
  });

  it('should throw when closing a confirm with an invalid action', () => {
    const confirmSvc = TestBed.inject(SkyConfirmService);

    confirmSvc.open({
      message: 'Are you sure?',
      type: SkyConfirmType.OK,
    });

    const confirmController = TestBed.inject(SkyConfirmTestingController);
    expect(() => confirmController.close({ action: 'foobar' })).toThrowError(
      'The confirm dialog does not have a button configured for the "foobar" action.',
    );
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

  it('should throw if expecting a confirm to be open with differing config', () => {
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

  it('should throw if expecting a confirm to be open with a different button ordering', () => {
    const { confirmController, fixture } = setupTest();

    fixture.detectChanges();
    launchCustomDeleteConfirmation(fixture);

    expect(() =>
      confirmController.expectOpen({
        message: 'Are you sure? This cannot be undone.',
        type: SkyConfirmType.Custom,
        buttons: [
          {
            action: 'no', // Wrong order
            text: 'No',
          },
          {
            action: 'yes',
            text: 'Yes',
          },
        ],
      }),
    )
      .toThrowError(`Expected a confirm dialog to be open with a specific configuration.
Expected:
{
  "message": "Are you sure? This cannot be undone.",
  "type": 0,
  "buttons": [
    {
      "action": "no",
      "text": "No"
    },
    {
      "action": "yes",
      "text": "Yes"
    }
  ]
}
Actual:
{
  "message": "Are you sure? This cannot be undone.",
  "type": 0,
  "buttons": [
    {
      "action": "yes",
      "text": "Yes"
    },
    {
      "action": "no",
      "text": "No"
    }
  ]
}
`);
  });

  it('should throw if expecting a confirm to be open with more buttons than expected', () => {
    const { confirmController, fixture } = setupTest();

    fixture.detectChanges();
    launchCustomDeleteConfirmation(fixture);

    expect(() =>
      confirmController.expectOpen({
        message: 'Are you sure? This cannot be undone.',
        type: SkyConfirmType.Custom,
        buttons: [
          {
            action: 'yes',
            text: 'Yes',
          },
        ],
      }),
    )
      .toThrowError(`Expected a confirm dialog to be open with a specific configuration.
Expected:
{
  "message": "Are you sure? This cannot be undone.",
  "type": 0,
  "buttons": [
    {
      "action": "yes",
      "text": "Yes"
    }
  ]
}
Actual:
{
  "message": "Are you sure? This cannot be undone.",
  "type": 0,
  "buttons": [
    {
      "action": "yes",
      "text": "Yes"
    },
    {
      "action": "no",
      "text": "No"
    }
  ]
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
