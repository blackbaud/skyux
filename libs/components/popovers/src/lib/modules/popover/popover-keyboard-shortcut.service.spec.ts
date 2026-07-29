import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SkyPopoverKeyboardShortcutService } from './popover-keyboard-shortcut.service';

describe('SkyPopoverKeyboardShortcutService', () => {
  let service: SkyPopoverKeyboardShortcutService;
  let cleanupEls: HTMLElement[];

  function createFocusableElement(parent?: HTMLElement): HTMLButtonElement {
    const el = document.createElement('button');
    (parent ?? document.body).appendChild(el);
    cleanupEls.push(el);
    return el;
  }

  function fireAltArrowUp(altKey = true): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      altKey,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    return event;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkyPopoverKeyboardShortcutService);
    cleanupEls = [];
  });

  afterEach(() => {
    cleanupEls.forEach((el) => el.remove());
  });

  it('should call open() when exactly one registered element is within the focused element', () => {
    const trigger = createFocusableElement();
    const open = jasmine.createSpy('open');
    service.register(new ElementRef(trigger), open);

    trigger.focus();
    fireAltArrowUp();

    expect(open).toHaveBeenCalledTimes(1);
  });

  it('should not call open() when no registered elements are within the focused element', () => {
    const trigger = createFocusableElement();
    const unrelated = createFocusableElement();
    const open = jasmine.createSpy('open');
    service.register(new ElementRef(trigger), open);

    unrelated.focus();
    fireAltArrowUp();

    expect(open).not.toHaveBeenCalled();
  });

  it('should not call open() when multiple registered elements are within the focused element', () => {
    const container = document.createElement('div');
    container.tabIndex = -1;
    document.body.appendChild(container);
    cleanupEls.push(container);

    const triggerA = createFocusableElement(container);
    const triggerB = createFocusableElement(container);
    const openA = jasmine.createSpy('openA');
    const openB = jasmine.createSpy('openB');
    service.register(new ElementRef(triggerA), openA);
    service.register(new ElementRef(triggerB), openB);

    container.focus();
    fireAltArrowUp();

    expect(openA).not.toHaveBeenCalled();
    expect(openB).not.toHaveBeenCalled();
  });

  it('should not call open() for keys other than Alt+ArrowUp', () => {
    const trigger = createFocusableElement();
    const open = jasmine.createSpy('open');
    service.register(new ElementRef(trigger), open);

    trigger.focus();
    fireAltArrowUp(false);

    expect(open).not.toHaveBeenCalled();
  });

  it('should call preventDefault on the keyboard event when opening', () => {
    const trigger = createFocusableElement();
    service.register(new ElementRef(trigger), jasmine.createSpy('open'));

    trigger.focus();
    const event = fireAltArrowUp();

    expect(event.defaultPrevented).toEqual(true);
  });

  it('should not call open() when there is no active element', () => {
    const trigger = createFocusableElement();
    const open = jasmine.createSpy('open');
    service.register(new ElementRef(trigger), open);

    trigger.focus();
    spyOnProperty(document, 'activeElement').and.returnValue(null);

    fireAltArrowUp();

    expect(open).not.toHaveBeenCalled();
  });

  it('should stop calling open() once unregistered', () => {
    const trigger = createFocusableElement();
    const open = jasmine.createSpy('open');
    const unregister = service.register(new ElementRef(trigger), open);

    unregister();
    trigger.focus();
    fireAltArrowUp();

    expect(open).not.toHaveBeenCalled();
  });
});
