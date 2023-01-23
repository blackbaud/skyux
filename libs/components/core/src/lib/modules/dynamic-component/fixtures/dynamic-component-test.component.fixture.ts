import {
  Component,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'sky-dynamic-component-test',
  template: `<div class="component-test">
      {{ message }}
      <ng-container *ngIf="greeting">{{ greeting }}</ng-container>
    </div>
    <div #content></div>`,
})
export class DynamicComponentTestComponent implements OnInit {
  @Input()
  public message: string | undefined;

  @ViewChild('content', {
    read: ViewContainerRef,
    static: false,
  })
  public content: ViewContainerRef | undefined;

  constructor(@Inject('greeting') @Optional() public greeting?: string) {}

  public ngOnInit(): void {
    this.message = 'Hello world';
  }
}
