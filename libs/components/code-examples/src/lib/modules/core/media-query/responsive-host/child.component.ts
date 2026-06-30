import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyMediaQueryService } from '@skyux/core';

@Component({
  selector: 'app-child',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<p>Breakpoint for child: {{ breakpoint() }}</p>`,
})
export class DemoChildComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
