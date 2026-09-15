import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect } from '@skyux-sdk/testing';
import {
  SkyHref,
  SkyHrefResolver,
  SkyHrefResolverArgs,
  SkyHrefResolverService,
} from '@skyux/router';
import { SkyButton } from './button';
import { SkyButtonPermalink } from './button-permalink';
import { SkyButtonStyle } from './button-style';
import { SkyButtonType } from './button-type';

@Injectable()
class MockHrefResolverService implements SkyHrefResolver {
  public resolveHref(args: SkyHrefResolverArgs): Promise<SkyHref> {
    return Promise.resolve({
      url: args.url,
      userHasAccess: args.url !== 'https://example.com/no-access',
    });
  }
}

describe('Button component', () => {
  let fixture: ComponentFixture<SkyButton>;

  function getAnchor(): HTMLAnchorElement | null {
    return (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLAnchorElement>('a');
  }

  function getButton(): HTMLButtonElement | null {
    return (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLButtonElement>('button');
  }

  function getAnchorOrButton(): HTMLAnchorElement | HTMLButtonElement | null {
    return getButton() ?? getAnchor();
  }

  function getButtonText(): string | undefined {
    return getAnchorOrButton()?.innerText.trim();
  }

  function getAriaLabel(): string | null | undefined {
    return getAnchorOrButton()?.getAttribute('aria-label');
  }

  function getIcon(): HTMLElement | null | undefined {
    return getAnchorOrButton()?.querySelector('sky-icon');
  }

  function validateButtonStyle(buttonStyle?: SkyButtonStyle): void {
    if (buttonStyle) {
      fixture.componentRef.setInput('buttonStyle', buttonStyle);
      fixture.detectChanges();
    }

    const buttonOrAnchor = getAnchorOrButton();

    expect(buttonOrAnchor).toHaveCssClass('sky-btn');
    expect(buttonOrAnchor).toHaveCssClass(
      `sky-btn-${buttonStyle ?? 'default'}`,
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyButton],
      providers: [
        provideRouter([]),
        {
          provide: SkyHrefResolverService,
          useClass: MockHrefResolverService,
        },
      ],
    });

    fixture = TestBed.createComponent(SkyButton);
    fixture.componentRef.setInput('labelText', 'Label text');
    fixture.detectChanges();
  });

  // These tests apply to both button and anchor variants.
  function runCommonTests(): void {
    it('should display the expected label text', () => {
      fixture.componentRef.setInput('labelText', 'Test button');
      fixture.detectChanges();

      expect(getButtonText()).toBe('Test button');
    });

    it('should set aria-label when label is hidden', () => {
      fixture.componentRef.setInput('labelHidden', true);
      fixture.componentRef.setInput('labelText', 'Test button');
      fixture.detectChanges();

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
      validateButtonStyle('link');
      validateButtonStyle('link-inline');
      validateButtonStyle('primary');
    });

    it('should add the expected class when set to block', () => {
      fixture.componentRef.setInput('block', true);
      fixture.detectChanges();

      expect(getAnchorOrButton()).toHaveCssClass('sky-btn-block');
    });

    it('should disable the button when disabled is specified', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      // When disabled, a button is rendered even when a permalink is specified.
      expect(getButton()?.disabled).toBeTrue();
    });

    describe('with icon', () => {
      it('should set the expected icon', () => {
        fixture.componentRef.setInput('iconName', 'add');
        fixture.detectChanges();

        expect(
          getIcon()?.querySelector('svg')?.getAttribute('data-sky-icon'),
        ).toBe('add');
      });

      it('should add the expected icon logo class', () => {
        fixture.componentRef.setInput('logo', true);
        fixture.componentRef.setInput('iconName', 'add');
        fixture.detectChanges();

        expect(getIcon()).toHaveCssClass('sky-btn-block-logo');
      });
    });
  }

  describe('in button mode', () => {
    function validateButtonType(buttonType?: SkyButtonType): void {
      if (buttonType) {
        fixture.componentRef.setInput('buttonType', buttonType);
        fixture.detectChanges();
      }

      expect(getButton()?.type).toBe(buttonType ?? 'button');
    }

    runCommonTests();

    it('should default to "button" type when no button type is specified', () => {
      validateButtonType();
    });

    it('should set the expected button type', () => {
      validateButtonType('button');
      validateButtonType('reset');
      validateButtonType('submit');
    });

    it('should fire the click event when the user clicks the button', () => {
      const clickHandler = jasmine.createSpy('clickHandler');

      fixture.componentInstance.buttonClick.subscribe(clickHandler);

      getButton()?.click();

      expect(clickHandler).toHaveBeenCalledOnceWith(jasmine.any(PointerEvent));
    });
  });

  describe('in anchor mode', () => {
    async function setPermalink(permalink: SkyButtonPermalink): Promise<void> {
      fixture.componentRef.setInput('permalink', permalink);

      fixture.detectChanges();
      await fixture.whenStable();

      // A second detectChanges() is needed to apply the result from the href
      // resolver service to the template.
      fixture.detectChanges();
    }

    it('should display a disabled button instead of an anchor when disabled', async () => {
      await setPermalink({
        url: 'https://example.com/',
      });

      expect(getAnchor()).not.toBeNull();
      expect(getButton()).toBeNull();

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getAnchor()).toBeNull();
      expect(getButton()?.disabled).toBeTrue();
    });

    describe('with permalink.url', () => {
      beforeEach(async () => {
        await setPermalink({
          url: 'https://example.com/',
        });
      });

      runCommonTests();

      it('should set the expected href', () => {
        expect(getAnchor()?.getAttribute('href')).toBe('https://example.com/');
      });

      it('should hide the anchor when user does not have access', async () => {
        expect(getAnchor()?.hidden).toBeFalse();
        expect(getButton()).toBeNull();

        await setPermalink({
          url: 'https://example.com/no-access',
        });

        expect(getAnchor()?.hidden).toBeTrue();
        expect(getButton()).toBeNull();
      });
    });

    describe('with permalink.route.commands', () => {
      beforeEach(async () => {
        await setPermalink({
          route: {
            commands: ['/foo/bar'],
          },
        });
      });

      runCommonTests();

      it('should set the expected href', () => {
        expect(getAnchor()?.getAttribute('href')).toBe('/foo/bar');
      });
    });
  });
});
