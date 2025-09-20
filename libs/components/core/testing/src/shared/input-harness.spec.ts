import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, Directive, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { SkyInputHarness } from './input-harness';

@Directive({
  selector: 'input[skyFoo]',
  standalone: true,
})
class TestDirective {}

@Component({
  imports: [FormsModule, ReactiveFormsModule, TestDirective],
  template: `
    <form [formGroup]="formGroup">
      <input type="text" formControlName="firstName" skyFoo />
    </form>
  `,
})
class TestComponent {
  public readonly firstName = new FormControl<string>('');

  protected formGroup = inject(FormBuilder).group({
    firstName: this.firstName,
  });
}

class InputTestHarness extends SkyInputHarness {
  public static hostSelector = 'input[skyFoo]';
}

describe('SkyQueryableComponentHarness', () => {
  async function setup(): Promise<{
    control: FormControl<string | null>;
    fixture: ComponentFixture<TestComponent>;
    harness: InputTestHarness;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const control = fixture.componentInstance.firstName;

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(InputTestHarness);

    return { control, fixture, harness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });
  });

  it('should focus and blur the input', async () => {
    const { control, fixture, harness } = await setup();

    await harness.focus();

    const inputEl = fixture.nativeElement.querySelector('input');

    expect(document.activeElement).toEqual(inputEl);
    expect(control.touched).toEqual(false);
    await expectAsync(harness.isFocused()).toBeResolvedTo(true);

    await harness.blur();

    expect(document.activeElement).not.toEqual(inputEl);
    expect(control.touched).toEqual(true);
    await expectAsync(harness.isFocused()).toBeResolvedTo(false);
  });

  it('should enter text and clear the input', async () => {
    const { control, harness } = await setup();

    await harness.setValue('Jayne');

    expect(control.value).toEqual('Jayne');
    await expectAsync(harness.getValue()).toBeResolvedTo('Jayne');

    await harness.clear();

    expect(control.value).toEqual('');
    await expectAsync(harness.getValue()).toBeResolvedTo('');
  });

  it('should check if input is disabled', async () => {
    const { control, harness } = await setup();

    await expectAsync(harness.isDisabled()).toBeResolvedTo(false);

    control.disable();

    await expectAsync(harness.isDisabled()).toBeResolvedTo(true);
  });
});
