import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyContainerBreakpointObserverDirective,
  SkyMediaQueryService,
} from '@skyux/core';

@Component({
  hostDirectives: [SkyContainerBreakpointObserverDirective],
  selector: 'app-container',
  standalone: true,
  styles: `
    :host {
      border: 1px solid var(--sky-border-color-neutral-medium-dark);
      display: block;
      margin: 0 auto;
      max-width: 800px;
    }
  `,
  template: ` <p>Breakpoint within container: {{ breakpoint() }}</p> `,
})
export class DemoContainerComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
