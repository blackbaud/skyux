import { DebugElement, ElementRef } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyA11yForRootCompatModule } from '../shared/a11y-for-root-compat.module';

import { SkySkipLink } from './skip-link';
import { SkySkipLinkHostComponent } from './skip-link-host.component';
import { SkySkipLinkModule } from './skip-link.module';

describe('Skip link host component', () => {
  let testEl1: HTMLDivElement;
  let testEl2: HTMLDivElement;

  function createTestDiv(): HTMLDivElement {
    const testEl = document.createElement('div');
    testEl.tabIndex = -1;

    document.body.appendChild(testEl);

    return testEl;
  }

  function validateSkipLink(
    link: SkySkipLink,
    skipLinkEl: DebugElement,
    elToFocus: HTMLElement
  ) {
    expect(skipLinkEl.nativeElement).toHaveText(`Skip to ${link.title}`);

    skipLinkEl.nativeElement.click();

    expect(document.activeElement).toBe(elToFocus);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkySkipLinkModule, SkyA11yForRootCompatModule],
    });

    testEl1 = createTestDiv();
    testEl2 = createTestDiv();
  });

  afterEach(() => {
    document.body.removeChild(testEl1);
    document.body.removeChild(testEl2);
  });

  it('should render a list of skip links', async(() => {
    const fixture = TestBed.createComponent(SkySkipLinkHostComponent);

    const links = [
      {
        elementRef: new ElementRef(testEl1),
        title: 'Link 1',
      },
      {
        elementRef: new ElementRef(testEl2),
        title: 'Link 2',
      },
    ];

    fixture.componentInstance.links = links;
    fixture.detectChanges();

    const skipLinkEls = fixture.debugElement.queryAll(By.css('.sky-skip-link'));

    validateSkipLink(links[0], skipLinkEls[0], testEl1);
    validateSkipLink(links[1], skipLinkEls[1], testEl2);
  }));

  it('should be accssible', async () => {
    const fixture = TestBed.createComponent(SkySkipLinkHostComponent);

    const links = [
      {
        elementRef: new ElementRef(testEl1),
        title: 'Link 1',
      },
      {
        elementRef: new ElementRef(testEl2),
        title: 'Link 2',
      },
    ];

    fixture.componentInstance.links = links;
    fixture.detectChanges();
    await fixture.whenStable();

    const linkContainer =
      document.querySelector('.sky-skip-link').parentElement;
    await expectAsync(linkContainer).toBeAccessible();

    // Remove links from the DOM.
    fixture.componentInstance.links = [];
    fixture.detectChanges();
  });
});
