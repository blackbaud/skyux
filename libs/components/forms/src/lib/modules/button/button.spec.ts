import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect, expectAsync } from '@skyux-sdk/testing';
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

  async function validateButtonStyle(
    buttonStyle?: SkyButtonStyle,
  ): Promise<void> {
    if (buttonStyle) {
      fixture.componentRef.setInput('buttonStyle', buttonStyle);
      fixture.detectChanges();
    }

    const buttonOrAnchor = getAnchorOrButton();

    expect(buttonOrAnchor).toHaveCssClass('sky-btn');
    expect(buttonOrAnchor).toHaveCssClass(
      `sky-btn-${buttonStyle ?? 'default'}`,
    );

    await expectAsync(fixture.nativeElement).toBeAccessible();
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
    it('should display the expected label text', async () => {
      fixture.componentRef.setInput('labelText', 'Test button');
      fixture.detectChanges();

      expect(getButtonText()).toBe('Test button');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should set aria-label when label is hidden', async () => {
      fixture.componentRef.setInput('labelHidden', true);
      fixture.componentRef.setInput('labelText', 'Test button');
      fixture.detectChanges();

      expect(getButtonText()).toBe('');
      expect(getAriaLabel()).toBe('Test button');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should default to "default" style when no button style is specified', async () => {
      await validateButtonStyle();
    });

    it('should add the expected CSS class for the specified button style', async () => {
      await validateButtonStyle('danger');
      await validateButtonStyle('default');
      await validateButtonStyle('icon-borderless');
      await validateButtonStyle('link');
      await validateButtonStyle('link-inline');
      await validateButtonStyle('primary');
    });

    it('should add the expected class when set to block', async () => {
      fixture.componentRef.setInput('block', true);
      fixture.detectChanges();

      expect(getAnchorOrButton()).toHaveCssClass('sky-btn-block');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should disable the button when disabled is specified', async () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      // When disabled, a button is rendered even when a permalink is specified.
      expect(getButton()?.disabled).toBeTrue();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    describe('with icon', () => {
      it('should set the expected icon', async () => {
        fixture.componentRef.setInput('iconName', 'add');
        fixture.detectChanges();

        expect(
          getIcon()?.querySelector('svg')?.getAttribute('data-sky-icon'),
        ).toBe('add');

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should add the expected icon logo class', async () => {
        fixture.componentRef.setInput('logo', true);
        fixture.componentRef.setInput('iconName', 'add');
        fixture.detectChanges();

        expect(getIcon()).toHaveCssClass('sky-btn-block-logo');

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });
  }

  describe('in button mode', () => {
    async function validateButtonType(
      buttonType?: SkyButtonType,
    ): Promise<void> {
      if (buttonType) {
        fixture.componentRef.setInput('buttonType', buttonType);
        fixture.detectChanges();
      }

      expect(getButton()?.type).toBe(buttonType ?? 'button');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    }

    runCommonTests();

    it('should default to "button" type when no button type is specified', async () => {
      await validateButtonType();
    });

    it('should set the expected button type', async () => {
      await validateButtonType('button');
      await validateButtonType('reset');
      await validateButtonType('submit');
    });

    it('should fire the click event when the user clicks the button', async () => {
      const clickHandler = jasmine.createSpy('clickHandler');

      fixture.componentInstance.buttonClick.subscribe(clickHandler);

      getButton()?.click();

      expect(clickHandler).toHaveBeenCalledOnceWith(jasmine.any(PointerEvent));

      await expectAsync(fixture.nativeElement).toBeAccessible();
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

      await expectAsync(fixture.nativeElement).toBeAccessible();

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getAnchor()).toBeNull();
      expect(getButton()?.disabled).toBeTrue();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    describe('with permalink.url', () => {
      beforeEach(async () => {
        await setPermalink({
          url: 'https://example.com/',
        });
      });

      runCommonTests();

      it('should set the expected href', async () => {
        expect(getAnchor()?.getAttribute('href')).toBe('https://example.com/');

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });

      it('should hide the anchor when user does not have access', async () => {
        expect(getAnchor()?.hidden).toBeFalse();
        expect(getButton()).toBeNull();

        await expectAsync(fixture.nativeElement).toBeAccessible();

        await setPermalink({
          url: 'https://example.com/no-access',
        });

        expect(getAnchor()?.hidden).toBeTrue();
        expect(getButton()).toBeNull();

        await expectAsync(fixture.nativeElement).toBeAccessible();
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

      it('should set the expected href', async () => {
        expect(getAnchor()?.getAttribute('href')).toBe('/foo/bar');

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });
  });
});
