import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyIconHarness } from '@skyux/icon/testing';

import { SkyBlockquoteTestComponent } from './fixtures/blockquote.component.fixture';

describe('Blockquote component', () => {
  let fixture: ComponentFixture<SkyBlockquoteTestComponent>;

  function getBlockquoteElement(): HTMLElement {
    return fixture.nativeElement.querySelector('.sky-blockquote');
  }

  function getAttributionElement(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.sky-blockquote-attribution');
  }

  function getSourceLinkElement(): HTMLAnchorElement | null {
    return fixture.nativeElement.querySelector('a.sky-blockquote-source-link');
  }

  function getAttributionText(): string | undefined {
    return getAttributionElement()?.textContent?.replace(/\s+/g, ' ').trim();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyBlockquoteTestComponent);
  });

  it('should render projected quote text', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector(
        'blockquote.sky-blockquote-content .sky-blockquote-text',
      ),
    ).toHaveText('Sample testimonial');
  });

  it('should not render an attribution when author and quoteSource are not set', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getAttributionElement()).toBeNull();
  });

  it('should render the author as text when quoteSource is not set', async () => {
    fixture.componentRef.setInput('author', 'Happy Customer');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getAttributionText()).toBe('— Happy Customer');
    expect(getSourceLinkElement()).toBeNull();
  });

  it('should link the author to quoteSource', async () => {
    fixture.componentRef.setInput('author', 'Happy Customer');
    fixture.componentRef.setInput('quoteSource', 'https://example.com/');
    fixture.detectChanges();
    await fixture.whenStable();

    const link = getSourceLinkElement();

    expect(link?.getAttribute('href')).toBe('https://example.com/');
    expect(link).toHaveText('Happy Customer');
  });

  it('should show "Source" when quoteSource is set without author', async () => {
    fixture.componentRef.setInput('quoteSource', 'https://example.com/');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getSourceLinkElement()).toHaveText('Source');
  });

  it('should update the attribution when inputs change', async () => {
    fixture.componentRef.setInput('author', 'Happy Customer');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getAttributionText()).toBe('— Happy Customer');

    fixture.componentRef.setInput('author', undefined);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getAttributionElement()).toBeNull();
  });

  it('should render the text-quote-opening icon', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const iconHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyIconHarness,
      );

    await expectAsync(iconHarness.getIconName()).toBeResolvedTo(
      'text-quote-opening',
    );
    await expectAsync(iconHarness.getIconSize()).toBeResolvedTo('l');
  });

  it("should use the default theme's info color for the border", async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const blockquoteEl = getBlockquoteElement();
    const infoColorEl = document.createElement('div');
    infoColorEl.style.color = 'var(--sky-highlight-color-info)';
    blockquoteEl.appendChild(infoColorEl);

    expect(getComputedStyle(blockquoteEl).borderLeftColor).toBe(
      getComputedStyle(infoColorEl).color,
    );

    infoColorEl.remove();
  });

  describe('a11y', () => {
    it('should be accessible without an attribution', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with a linked attribution', async () => {
      fixture.componentRef.setInput('author', 'Happy Customer');
      fixture.componentRef.setInput('quoteSource', 'https://example.com/');
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    describe('in modern theme', () => {
      beforeEach(() => {
        document.body.classList.add('sky-theme-modern', 'sky-theme-brand-base');
      });

      afterEach(() => {
        document.body.classList.remove(
          'sky-theme-modern',
          'sky-theme-brand-base',
        );
      });

      it('should be accessible with a linked attribution', async () => {
        fixture.componentRef.setInput('author', 'Happy Customer');
        fixture.componentRef.setInput('quoteSource', 'https://example.com/');
        fixture.detectChanges();
        await fixture.whenStable();

        await expectAsync(fixture.nativeElement).toBeAccessible();
      });
    });
  });
});
