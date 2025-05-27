import type { DebugElement } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import type { SkySkipLink } from './skip-link';
import { SkySkipLinkHostComponent } from './skip-link-host.component';

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
    elToFocus: HTMLElement,
  ): void {
    expect(skipLinkEl.nativeElement).toHaveText(`Skip to ${link.title}`);

    skipLinkEl.nativeElement.click();

    expect(document.activeElement).toBe(elToFocus);
  }

  beforeEach(() => {
    testEl1 = createTestDiv();
    testEl2 = createTestDiv();
  });

  afterEach(() => {
    document.body.removeChild(testEl1);
    document.body.removeChild(testEl2);
  });

  it('should render a list of skip links', () => {
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
  });

  it('should be accessible', async () => {
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
      document.querySelector('.sky-skip-link')?.parentElement;
    await expectAsync(linkContainer).toBeAccessible();

    // Remove links from the DOM.
    fixture.componentInstance.links = [];
    fixture.detectChanges();
  });
});
