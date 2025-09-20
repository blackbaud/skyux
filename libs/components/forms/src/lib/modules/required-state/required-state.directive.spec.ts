import { TestBed } from '@angular/core/testing';

import { ReactiveTestComponent } from './fixtures/reactive.component.fixture';
import { TemplateDrivenTestComponent } from './fixtures/template-driven.component.fixture';

describe('required-state directive', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should apply a `required` input to a host component', () => {
    const fixture = TestBed.createComponent(TemplateDrivenTestComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toEqual('required: false');

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toEqual('required: true');
  });

  it('should check form control validators', () => {
    const fixture = TestBed.createComponent(ReactiveTestComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toEqual('required: false');

    fixture.componentInstance.makeRequired();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toEqual('required: true');
  });
});
