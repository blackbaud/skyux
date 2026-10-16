import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBoxButtonHarnessTest } from './fixtures/input-box-button-harness-test';
import { SkyInputBoxButtonHarness } from './input-box-button-harness';

describe('Input box button harness', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<InputBoxButtonHarnessTest>;
    harness: SkyInputBoxButtonHarness;
  }> {
    const fixture = TestBed.createComponent(InputBoxButtonHarnessTest);
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
    const insetHarness = await TestbedHarnessEnvironment.loader(
      fixture,
    ).getHarness(
      SkyInputBoxButtonHarness.with({ dataSkyId: 'test-button-inset' }),
    );

    await expectAsync(harness.getButtonStyle()).toBeResolvedTo('default');
    await expectAsync(insetHarness.getButtonStyle()).toBeResolvedTo('inset');
  });

  it('should get the position', async () => {
    const { fixture, harness } = await setupTest();
    const leftHarness = await TestbedHarnessEnvironment.loader(
      fixture,
    ).getHarness(
      SkyInputBoxButtonHarness.with({ dataSkyId: 'test-button-left' }),
    );

    await expectAsync(harness.getPosition()).toBeResolvedTo('right');
    await expectAsync(leftHarness.getPosition()).toBeResolvedTo('left');
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
    const fixture = TestBed.createComponent(InputBoxButtonHarnessTest);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await expectAsync(
      loader.getHarness(SkyInputBoxButtonHarness.with({ dataSkyId: 'nope' })),
    ).toBeRejected();
  });
});
