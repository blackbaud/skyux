import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[routerLink]'
})
export class RouterLinkStubDirective {
  @Input()
  public routerLink: any;

  public navigatedTo: any;

  @HostListener('click', ['$event.target'])
  public onClick() {
    this.navigatedTo = this.routerLink;
  }
}
