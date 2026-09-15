import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyButtonStyle, SkyButtonType } from '@skyux/forms';
import { SkyButtonHarness } from './button-harness';
import { ButtonTest } from './fixtures/button-test';

const BUTTON_LABEL = 'Button label';

describe('Button harness', () => {
  async function setupTest(): Promise<{
    buttonHarness: SkyButtonHarness;
    fixture: ComponentFixture<ButtonTest>;
  }> {
    await TestBed.configureTestingModule({
      imports: [ButtonTest],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(ButtonTest);
    fixture.componentRef.setInput('labelText', BUTTON_LABEL);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const buttonHarness = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId: 'test-button',
      }),
    );

    return { buttonHarness, fixture };
  }

  function runCommonTests(): void {
    async function validateButtonStyle(
      buttonHarness: SkyButtonHarness,
      fixture: ComponentFixture<ButtonTest>,
      buttonStyle: SkyButtonStyle,
    ): Promise<void> {
      fixture.componentRef.setInput('buttonStyle', buttonStyle);

      await expectAsync(buttonHarness.getButtonStyle()).toBeResolvedTo(
        buttonStyle,
      );
    }

    it('should return label text when the label is visible', async () => {
      const { buttonHarness } = await setupTest();

      await expectAsync(buttonHarness.getLabelText()).toBeResolvedTo(
        BUTTON_LABEL,
      );
    });

    it('should return label text when the label is hidden', async () => {
      const { buttonHarness, fixture } = await setupTest();

      fixture.componentRef.setInput('labelHidden', true);

      await expectAsync(buttonHarness.getLabelHidden()).toBeResolvedTo(true);
      await expectAsync(buttonHarness.getLabelText()).toBeResolvedTo(
        BUTTON_LABEL,
      );
    });

    it('should return the icon name', async () => {
      const { buttonHarness, fixture } = await setupTest();

      fixture.componentRef.setInput('iconName', 'add');

      await expectAsync(buttonHarness.getIconName()).toBeResolvedTo('add');
    });

    it('should return the button style', async () => {
      const { buttonHarness, fixture } = await setupTest();

      await validateButtonStyle(buttonHarness, fixture, 'danger');
      await validateButtonStyle(buttonHarness, fixture, 'default');
      await validateButtonStyle(buttonHarness, fixture, 'icon-borderless');
      await validateButtonStyle(buttonHarness, fixture, 'link');
      await validateButtonStyle(buttonHarness, fixture, 'link-inline');
      await validateButtonStyle(buttonHarness, fixture, 'primary');
    });

    it('should return whether the button is a block button', async () => {
      const { buttonHarness, fixture } = await setupTest();

      fixture.componentRef.setInput('block', true);

      await expectAsync(buttonHarness.isBlock()).toBeResolvedTo(true);
    });

    it('should return whether the icon is a logo', async () => {
      const { buttonHarness, fixture } = await setupTest();

      fixture.componentRef.setInput('block', true);
      fixture.componentRef.setInput('iconName', 'add');
      fixture.componentRef.setInput('logo', true);

      await expectAsync(buttonHarness.isBlock()).toBeResolvedTo(true);
      await expectAsync(buttonHarness.isLogo()).toBeResolvedTo(true);
    });

    it('should return whether the button is disabled', async () => {
      const { buttonHarness, fixture } = await setupTest();

      await expectAsync(buttonHarness.isDisabled()).toBeResolvedTo(false);

      fixture.componentRef.setInput('disabled', true);

      await expectAsync(buttonHarness.isDisabled()).toBeResolvedTo(true);
    });

    it('should click the button', async () => {
      const { buttonHarness, fixture } = await setupTest();

      const clickHandler = jasmine.createSpy('clickHandler');

      fixture.componentInstance.buttonClick.subscribe(clickHandler);

      await buttonHarness.click();

      // When a user clicks the button in a browser, a PointerEvent is raised,
      // but the simulated click here raises a MouseEvent, so check for that.
      expect(clickHandler).toHaveBeenCalledOnceWith(jasmine.any(MouseEvent));
    });

    it('should focus the button', async () => {
      const { buttonHarness } = await setupTest();

      await buttonHarness.focus();
      await expectAsync(buttonHarness.isFocused()).toBeResolvedTo(true);

      await buttonHarness.blur();
      await expectAsync(buttonHarness.isFocused()).toBeResolvedTo(false);
    });

    it('should return undefined URL when no permalink is specified', async () => {
      const { buttonHarness } = await setupTest();

      await expectAsync(buttonHarness.getUrl()).toBeResolvedTo(undefined);
    });
  }

  describe('in button mode', () => {
    async function validateButtonType(
      buttonHarness: SkyButtonHarness,
      fixture: ComponentFixture<ButtonTest>,
      buttonType?: SkyButtonType,
    ): Promise<void> {
      fixture.componentRef.setInput('buttonType', buttonType);

      await expectAsync(buttonHarness.getButtonType()).toBeResolvedTo(
        buttonType,
      );
    }

    runCommonTests();

    it('should return the button type', async () => {
      const { buttonHarness, fixture } = await setupTest();

      await validateButtonType(buttonHarness, fixture, 'button');
      await validateButtonType(buttonHarness, fixture, 'reset');
      await validateButtonType(buttonHarness, fixture, 'submit');
    });

    it('should return an undefined URL', async () => {
      const { buttonHarness } = await setupTest();

      await expectAsync(buttonHarness.getUrl()).toBeResolvedTo(undefined);
    });
  });

  describe('in anchor mode', () => {
    runCommonTests();

    it('should return the URL when using a permalink route', async () => {
      const { buttonHarness, fixture } = await setupTest();

      fixture.componentRef.setInput('permalink', {
        route: {
          commands: ['foo', 'bar'],
        },
      });

      await expectAsync(buttonHarness.getUrl()).toBeResolvedTo('/foo/bar');
    });

    it('should return the URL when using a permalink URL', async () => {
      const { buttonHarness, fixture } = await setupTest();

      fixture.componentRef.setInput('permalink', {
        url: 'https://example.com/',
      });

      await expectAsync(buttonHarness.getUrl()).toBeResolvedTo(
        'https://example.com/',
      );
    });
  });
});
