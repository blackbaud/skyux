import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyButton } from './button';
import { SkyButtonStyle } from './button-style';
import { SkyButtonType } from './button-type';

describe('Button component', () => {
  let testButton: ComponentFixture<SkyButton>;

  function getButton(): HTMLButtonElement {
    const el = testButton.nativeElement as HTMLElement;

    return el.querySelector<HTMLButtonElement>('button') as HTMLButtonElement;
  }

  function getButtonText(): string {
    return getButton().innerText.trim();
  }

  function getAriaLabel(): string | null {
    return getButton().getAttribute('aria-label');
  }

  function getIcon(): HTMLElement | null {
    return getButton().querySelector<HTMLElement>('sky-icon');
  }

  function validateButtonStyle(
    buttonStyle?: SkyButtonStyle,
    expectedCssClass?: string,
  ): void {
    if (buttonStyle) {
      testButton.componentRef.setInput('buttonStyle', buttonStyle);
      testButton.detectChanges();
    }

    expect(getButton()).toHaveCssClass('sky-btn');
    expect(getButton()).toHaveCssClass(
      expectedCssClass ?? `sky-btn-${buttonStyle ?? 'default'}`,
    );
  }

  function validateButtonType(buttonType?: SkyButtonType): void {
    if (buttonType) {
      testButton.componentRef.setInput('buttonType', buttonType);
      testButton.detectChanges();
    }

    expect(getButton().type).toBe(buttonType ?? 'button');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyButton],
    });

    testButton = TestBed.createComponent(SkyButton);
    testButton.componentRef.setInput('labelText', 'Label text');
    testButton.detectChanges();
  });

  it('should display the expected label text', () => {
    testButton.componentRef.setInput('labelText', 'Test button');
    testButton.detectChanges();

    expect(getButtonText()).toBe('Test button');
  });

  it('should set aria-label when label is hidden', () => {
    testButton.componentRef.setInput('labelHidden', true);
    testButton.componentRef.setInput('labelText', 'Test button');
    testButton.detectChanges();

    expect(getButtonText()).toBe('');
    expect(getAriaLabel()).toBe('Test button');
  });

  it('should default to "default" style when no button style is specified', () => {
    validateButtonStyle();
  });

  it('should add the expected CSS class for the specified button style', () => {
    validateButtonStyle('danger');
    validateButtonStyle('default');
    validateButtonStyle('icon-borderless');
    validateButtonStyle(
      'icon-borderless-on-prominent',
      'sky-btn-icon-borderless-on_prominent',
    );
    validateButtonStyle('link');
    validateButtonStyle('link-inline');
    validateButtonStyle('primary');
  });

  it('should default to "button" type when no button type is specified', () => {
    validateButtonType();
  });

  it('should set the expected button type', () => {
    validateButtonType('button');
    validateButtonType('reset');
    validateButtonType('submit');
  });

  it('should add the expected class when set to block', () => {
    testButton.componentRef.setInput('block', true);
    testButton.detectChanges();

    expect(getButton()).toHaveCssClass('sky-btn-block');
  });

  it('should disable the button when disabled is specified', () => {
    expect(getButton().disabled).toBeFalse();

    testButton.componentRef.setInput('disabled', true);
    testButton.detectChanges();

    expect(getButton().disabled).toBeTrue();
  });

  it('should fire the click event when the user clicks the button', () => {
    const clickHandler = jasmine.createSpy('clickHandler');

    testButton.componentInstance.buttonClick.subscribe(clickHandler);

    getButton().click();

    expect(clickHandler).toHaveBeenCalledOnceWith(jasmine.any(PointerEvent));
  });

  describe('with icon', () => {
    it('should set the expected icon', () => {
      testButton.componentRef.setInput('iconName', 'add');
      testButton.detectChanges();

      expect(
        getIcon()
          ?.querySelector<HTMLElement>('svg')
          ?.getAttribute('data-sky-icon'),
      ).toBe('add');
    });

    it('should add the expected icon logo class', () => {
      testButton.componentRef.setInput('logo', true);
      testButton.componentRef.setInput('iconName', 'add');
      testButton.detectChanges();

      expect(getIcon()).toHaveCssClass('sky-btn-block-logo');
    });
  });
});
