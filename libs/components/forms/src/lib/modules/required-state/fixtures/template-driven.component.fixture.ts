import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { TestControlComponent } from './test-control.component.fixture';

@Component({
  imports: [FormsModule, TestControlComponent],
  standalone: true,
  template: `<sky-test-control [required]="required" [(ngModel)]="foobar" />`,
})
export class TemplateDrivenTestComponent implements AfterViewInit, OnDestroy {
  @ViewChild(TestControlComponent)
  public testControlComponent: TestControlComponent | undefined;

  public required = false;

  protected foobar = '';

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

  public requiredChanged(required: boolean): boolean {
    return required;
  }
}
