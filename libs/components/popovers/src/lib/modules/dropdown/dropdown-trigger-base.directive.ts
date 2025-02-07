import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SkyDropdownButtonType } from './types/dropdown-button-type';

// This base directive exists only for the trigger button in the dropdown component's template.
// The ARIA label/labelledby functionality in SkyDropdownTriggerDirective caused async issues
// with existing unit tests in other projects like layout and angular-tree-component, so dropdown
// uses this base directive and applies the ARIA label and labelledby attributes directly.
// Consider consolidating this with the other trigger directive in 12 as a potentially breaking
// change since consumers may have accessibility tests that would fail due to the change.

/**
 * @internal
 */
@Directive({
  selector: '[skyDropdownTriggerBase]',
  standalone: true,
  host: {
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-controls]': 'isOpen() ? menuId() : null',
    '[attr.aria-haspopup]': 'menuAriaRole()',
    '[attr.title]': 'title()',
    '[attr.disabled]': 'disabled() || undefined',
    '(click)': 'triggerClick.next($event)',
    '(keydown)': 'triggerKeyDown.next($event)',
    '(mouseenter)': 'triggerMouseEnter.next($event)',
    '(mouseleave)': 'triggerMouseLeave.next($event)',
  },
})
export class SkyDropdownTriggerBaseDirective implements OnDestroy {
  public readonly nativeElement = inject(ElementRef).nativeElement;

  // Set by the dropdown component.
  public readonly isOpen = signal<boolean | undefined>(undefined);
  public readonly menuId = signal<string | null | undefined>(undefined);
  public readonly menuAriaRole = signal<string | undefined>(undefined);
  public readonly label = signal<string | undefined>(undefined);
  public readonly buttonType = signal<SkyDropdownButtonType | undefined>(
    undefined,
  );
  public readonly screenReaderLabelContextMenuId = signal<string | undefined>(
    undefined,
  );
  public readonly title = signal<string | undefined>(undefined);
  public readonly disabled = signal<boolean | undefined>(undefined);

  public readonly triggerClick = new Subject<MouseEvent>();
  public readonly triggerKeyDown = new Subject<KeyboardEvent>();
  public readonly triggerMouseEnter = new Subject<MouseEvent>();
  public readonly triggerMouseLeave = new Subject<MouseEvent>();

  public ngOnDestroy(): void {
    this.triggerClick.complete();
    this.triggerKeyDown.complete();
    this.triggerMouseEnter.complete();
    this.triggerMouseLeave.complete();
  }
}
