import {
  Component,
  ViewContainerRef,
  ViewChild,
  Input,
  TemplateRef,
  OnInit,
} from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'sky-list-toolbar-item-renderer',
  template: '<ng-template #container></ng-template>',
})
export class SkyListToolbarItemRendererComponent implements OnInit {
  @Input()
  public template: TemplateRef<any>;

  @ViewChild('container', {
    read: ViewContainerRef,
    static: true,
  })
  private container: ViewContainerRef;

  public ngOnInit() {
    if (this.template !== undefined) {
      this.container.createEmbeddedView(this.template, this);
    }
  }
}
