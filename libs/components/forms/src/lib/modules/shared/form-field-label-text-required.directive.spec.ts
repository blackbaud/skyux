import { Component, ViewChild, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyFormFieldLabelTextRequiredService } from '@skyux/forms';

import { SkyFormFieldLabelTextRequiredDirective } from './form-field-label-text-required.directive';

@Component({
  standalone: true,
  selector: 'sky-test',
  template: `Test.`,
  hostDirectives: [
    {
      directive: SkyFormFieldLabelTextRequiredDirective,
      inputs: ['labelText'],
    },
  ],
})
class TestComponent {
  @ViewChild(SkyFormFieldLabelTextRequiredDirective, { static: true })
  public directive!: SkyFormFieldLabelTextRequiredDirective;

  public readonly labelText = input<string | null | undefined>();
}

describe('FormFieldLabelTextRequiredDirective', () => {
  it('should do nothing', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentRef.setInput('labelText', 'test');
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('style'),
    ).toBeFalsy();
  });

  it('should set `display: none;`', () => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [SkyFormFieldLabelTextRequiredService],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.componentRef.setInput('labelText', undefined);
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).getAttribute('style'),
    ).toEqual('display: none;');
  });
});
