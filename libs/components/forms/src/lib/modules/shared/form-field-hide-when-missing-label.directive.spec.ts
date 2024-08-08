import { Component, ViewChild, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyFormFieldLabelTextRequiredService } from '@skyux/forms';

import { SkyFormFieldHideWhenMissingLabelDirective } from './form-field-hide-when-missing-label.directive';

@Component({
  standalone: true,
  selector: 'sky-test',
  template: `Test.`,
  hostDirectives: [
    {
      directive: SkyFormFieldHideWhenMissingLabelDirective,
      inputs: ['labelText'],
    },
  ],
})
class TestComponent {
  @ViewChild(SkyFormFieldHideWhenMissingLabelDirective, { static: true })
  public directive!: SkyFormFieldHideWhenMissingLabelDirective;

  public readonly labelText = input<string | null | undefined>();
}

describe('FormFieldHideWhenMissingLabelDirective', () => {
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
