import { DOCUMENT } from '@angular/common';
import { ElementRef, Injectable, OnDestroy, inject } from '@angular/core';

import { Subscription, fromEvent as observableFromEvent } from 'rxjs';

interface SkyPopoverKeyboardShortcutRegistration {
  elementRef: ElementRef;
  open: () => void;
}

/**
 * Listens for the Alt+ArrowUp keyboard shortcut and opens the popover whose
 * trigger element is the sole registered trigger within the focused element,
 * so popovers whose triggers aren't reachable via Tab (e.g. because a parent
 * element owns focus instead) can still be opened with the keyboard.
 * @internal
 */
@Injectable({ providedIn: 'root' })
export class SkyPopoverKeyboardShortcutService implements OnDestroy {
  #registrations = new Set<SkyPopoverKeyboardShortcutRegistration>();

  readonly #document = inject(DOCUMENT);

  #subscription: Subscription;

  constructor() {
    this.#subscription = observableFromEvent<KeyboardEvent>(
      this.#document,
      'keydown',
    ).subscribe((event) => this.#handleKeydown(event));
  }

  public ngOnDestroy(): void {
    this.#subscription.unsubscribe();
  }

  public register(elementRef: ElementRef, open: () => void): () => void {
    const registration: SkyPopoverKeyboardShortcutRegistration = {
      elementRef,
      open,
    };

    this.#registrations.add(registration);

    return () => this.#registrations.delete(registration);
  }

  #handleKeydown(event: KeyboardEvent): void {
    if (!event.altKey || event.key !== 'ArrowUp') {
      return;
    }

    const activeElement = this.#document.activeElement;

    if (!activeElement) {
      return;
    }

    const candidates = Array.from(this.#registrations).filter((registration) =>
      activeElement.contains(registration.elementRef.nativeElement),
    );

    if (candidates.length === 1) {
      event.preventDefault();
      candidates[0].open();
    }
  }
}
