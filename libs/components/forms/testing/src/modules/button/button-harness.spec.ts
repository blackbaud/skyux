import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from './button-harness';
import { ButtonHarnessTest } from './fixtures/button-harness-test';

describe('Button harness', () => {
  async function setupTest(
    options: { dataSkyId?: string; hideEmailLabel?: boolean } = {},
  ): Promise<{
    buttonHarness: SkyButtonHarness;
    fixture: ComponentFixture<ButtonHarnessTest>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [ButtonHarnessTest],
    }).compileComponents();

    const fixture = TestBed.createComponent(ButtonHarnessTest);
    if (options.hideEmailLabel) {
      fixture.componentRef.setInput('hideEmailLabel', true);
      fixture.detectChanges();
    }
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const buttonHarness: SkyButtonHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyButtonHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyButtonHarness);

    return { buttonHarness, fixture, loader };
  }

  it('should return label text when the label is visible', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'simple-button',
    });

    await expectAsync(buttonHarness.getLabelText()).toBeResolvedTo(
      'Simple button',
    );
  });

  it('should return label text when the label is hidden', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'icon-only-button',
    });

    await expectAsync(buttonHarness.getLabelHidden()).toBeResolvedTo(true);
    await expectAsync(buttonHarness.getLabelText()).toBeResolvedTo('Icon only');
  });

  it('should return the icon name', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'icon-only-button',
    });

    await expectAsync(buttonHarness.getIconName()).toBeResolvedTo('add');
  });

  it('should return the button style', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'primary-submit-button',
    });

    await expectAsync(buttonHarness.getButtonStyle()).toBeResolvedTo('primary');
  });

  it('should return the button style when the style is on-prominent', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'on-prominent-button',
    });

    await expectAsync(buttonHarness.getButtonStyle()).toBeResolvedTo(
      'icon-borderless-on-prominent',
    );
  });

  it('should return the button type', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'primary-submit-button',
    });

    await expectAsync(buttonHarness.getButtonType()).toBeResolvedTo('submit');
  });

  it('should return whether the button is a block button', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'block-button',
    });

    await expectAsync(buttonHarness.isBlock()).toBeResolvedTo(true);
  });

  it('should return whether the icon is a logo', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'block-logo-button',
    });

    await expectAsync(buttonHarness.isBlock()).toBeResolvedTo(true);
  });

  it('should return whether the button is disabled', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'disabled-button',
    });

    await expectAsync(buttonHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should click the button', async () => {
    const { buttonHarness, fixture } = await setupTest({
      dataSkyId: 'simple-button',
    });

    const clickSpy = spyOn(fixture.componentInstance, 'buttonClick');

    await buttonHarness.click();

    expect(clickSpy).toHaveBeenCalledOnceWith(jasmine.any(MouseEvent));
  });

  it('should focus the button', async () => {
    const { buttonHarness } = await setupTest({
      dataSkyId: 'simple-button',
    });

    await buttonHarness.focus();
    await expectAsync(buttonHarness.isFocused()).toBeResolvedTo(true);

    await buttonHarness.blur();
    await expectAsync(buttonHarness.isFocused()).toBeResolvedTo(false);
  });
});
