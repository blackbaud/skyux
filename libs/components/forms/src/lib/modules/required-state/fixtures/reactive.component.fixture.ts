import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { TestControlComponent } from './test-control.component.fixture';

@Component({
  imports: [ReactiveFormsModule, TestControlComponent],
  standalone: true,
  template: `<form [formGroup]="formGroup">
    <sky-test-control formControlName="foobar" />
  </form>`,
})
export class ReactiveTestComponent implements AfterViewInit, OnDestroy {
  @ViewChild(TestControlComponent)
  public testControlComponent: TestControlComponent | undefined;

  protected foobar = new FormControl('', { validators: [] });

  protected formGroup = inject(FormBuilder).group({
    foobar: this.foobar,
  });

  #ngUnsubscribe = new Subject<void>();

  public ngAfterViewInit(): void {
    this.testControlComponent?.requiredState.requiredStateChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((required) => this.requiredChanged(required));
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public makeRequired(): void {
    this.foobar.addValidators(Validators.required);
    this.foobar.updateValueAndValidity();
  }

  public requiredChanged(required: boolean): boolean {
    return required;
  }
}
