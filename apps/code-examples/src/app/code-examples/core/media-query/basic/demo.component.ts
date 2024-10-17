import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyContainerBreakpointObserverDirective,
  SkyMediaQueryService,
} from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';

@Component({
  imports: [
    CommonModule,
    SkyContainerBreakpointObserverDirective,
    SkyIconModule,
  ],
  selector: 'app-demo',
  standalone: true,
  styleUrl: './demo.component.scss',
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  protected breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange,
  );
}
