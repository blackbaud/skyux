import {
  ChangeDetectorRef,
  Component,
  contentChild,
  inject,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField, disabled, form, required } from '@angular/forms/signals';
import { By } from '@angular/platform-browser';

import { skyWatchFormFieldChanges } from './watch-form-field-changes';

// Mirrors how real consumers (e.g. `SkyInputBoxComponent`) call `skyWatchFormFieldChanges`:
// the watched `[formField]` binding lives in a separately-rendered consumer template that's
// projected in, not in this component's own template.
@Component({
  standalone: true,
  selector: 'watch-form-field-changes-host',
  template: `<ng-content />`,
})
class WatchFormFieldChangesHostComponent {
  public readonly changeRef = inject(ChangeDetectorRef);
  public readonly readValues: unknown[] = [];

  protected readonly formField = contentChild(FormField);

  constructor() {
    skyWatchFormFieldChanges(this.formField, this.changeRef, (state) => {
      this.readValues.push(state.value());
    });
  }
}

@Component({
  standalone: true,
  imports: [FormField, WatchFormFieldChangesHostComponent],
  template: `<watch-form-field-changes-host>
    <input [formField]="testForm" />
  </watch-form-field-changes-host>`,
})
class WatchFormFieldChangesFixtureComponent {
  public readonly model = signal('');
  public readonly isDisabled = signal(false);
  public readonly testForm = form(this.model, (p) => {
    required(p);
    disabled(p, { when: () => this.isDisabled() });
  });
}

@Component({
  standalone: true,
  imports: [WatchFormFieldChangesHostComponent],
  template: `<watch-form-field-changes-host />`,
})
class WatchFormFieldChangesNoFieldFixtureComponent {}

describe('skyWatchFormFieldChanges', () => {
  let fixture: ComponentFixture<WatchFormFieldChangesFixtureComponent>;
  let testComponent: WatchFormFieldChangesFixtureComponent;
  let host: WatchFormFieldChangesHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WatchFormFieldChangesFixtureComponent],
    });

    fixture = TestBed.createComponent(WatchFormFieldChangesFixtureComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();

    host = fixture.debugElement.query(
      By.directive(WatchFormFieldChangesHostComponent),
    ).componentInstance as WatchFormFieldChangesHostComponent;
  });

  it('marks the change detector for check when the field becomes touched', () => {
    const markForCheckSpy = spyOn(
      host.changeRef,
      'markForCheck',
    ).and.callThrough();

    testComponent.testForm().markAsTouched();
    fixture.detectChanges();

    expect(markForCheckSpy).toHaveBeenCalled();
  });

  it('marks the change detector for check when the field becomes disabled', () => {
    const markForCheckSpy = spyOn(
      host.changeRef,
      'markForCheck',
    ).and.callThrough();

    testComponent.isDisabled.set(true);
    fixture.detectChanges();

    expect(markForCheckSpy).toHaveBeenCalled();
  });

  it('invokes the readAdditionalSignals callback with the field state', () => {
    testComponent.model.set('a value');
    fixture.detectChanges();

    expect(host.readValues).toContain('a value');
  });

  it('does not throw when no formField is bound', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [WatchFormFieldChangesNoFieldFixtureComponent],
    });

    expect(() => {
      const noFieldFixture = TestBed.createComponent(
        WatchFormFieldChangesNoFieldFixtureComponent,
      );
      noFieldFixture.detectChanges();
    }).not.toThrow();
  });
});
