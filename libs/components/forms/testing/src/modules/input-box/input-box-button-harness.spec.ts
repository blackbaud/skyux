import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyInputBoxButton,
  SkyInputBoxButtonStyle,
  SkyInputBoxModule,
} from '@skyux/forms';

import { SkyInputBoxButtonHarness } from './input-box-button-harness';

@Component({
  imports: [SkyInputBoxModule, SkyInputBoxButton],
  template: `
    <sky-input-box>
      <input type="text" />
      <sky-input-box-button
        data-sky-id="test-button"
        iconName="calendar-ltr"
        labelText="Select a date"
        [buttonStyle]="buttonStyle()"
        [disabled]="disabled()"
        (buttonClick)="clickCount = clickCount + 1"
      />
    </sky-input-box>
  `,
})
class TestComponent {
  public readonly buttonStyle = input<SkyInputBoxButtonStyle>('default');
  public readonly disabled = input(false);
  public clickCount = 0;
}

describe('Input box button harness', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<TestComponent>;
    harness: SkyInputBoxButtonHarness;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyInputBoxButtonHarness.with({ dataSkyId: 'test-button' }),
    );

    return { fixture, harness };
  }

  it('should get the icon name', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getIconName()).toBeResolvedTo('calendar-ltr');
  });

  it('should get the label text', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getLabelText()).toBeResolvedTo('Select a date');
  });

  it('should get the button style', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getButtonStyle()).toBeResolvedTo('default');

    fixture.componentRef.setInput('buttonStyle', 'inset');

    await expectAsync(harness.getButtonStyle()).toBeResolvedTo('inset');
  });

  it('should get the disabled state', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.isDisabled()).toBeResolvedTo(false);

    fixture.componentRef.setInput('disabled', true);

    await expectAsync(harness.isDisabled()).toBeResolvedTo(true);
  });

  it('should click the button', async () => {
    const { fixture, harness } = await setupTest();

    await harness.click();

    expect(fixture.componentInstance.clickCount).toBe(1);
  });

  it('should focus and blur the button', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.isFocused()).toBeResolvedTo(false);

    await harness.focus();

    await expectAsync(harness.isFocused()).toBeResolvedTo(true);

    await harness.blur();

    await expectAsync(harness.isFocused()).toBeResolvedTo(false);
  });

  it('should not find a button that does not match the filters', async () => {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await expectAsync(
      loader.getHarness(SkyInputBoxButtonHarness.with({ dataSkyId: 'nope' })),
    ).toBeRejected();
  });
});
