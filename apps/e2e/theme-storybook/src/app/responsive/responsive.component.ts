import { Component } from '@angular/core';

@Component({
  selector: 'app-responsive',
  templateUrl: './responsive.component.html',
  styleUrls: ['./responsive.component.scss'],
})
export class ResponsiveComponent {
  public readonly containerBreakpoints = ['xs', 'sm', 'md', 'lg'];

  public currentContainerBreakpoint = 'xs';

  public currentScreenBreakpoint: string | undefined;

  public setClass(breakpoint: string) {
    this.currentContainerBreakpoint = breakpoint;
  }
}
