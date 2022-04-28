import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

/**
 * @internal
 */
@Component({
  selector: 'sky-list-filter-inline-item-renderer',
  template: '<ng-template #container></ng-template>',
})
export class SkyListFilterInlineItemRendererComponent implements OnInit {
  @Input()
  public template: TemplateRef<unknown>;
  @Input()
  public filter: any;

  @ViewChild('container', {
    read: ViewContainerRef,
    static: true,
  })
  private container: ViewContainerRef;

  public ngOnInit() {
    /* istanbul ignore else */
    /* sanity check */
    if (this.template !== undefined) {
      this.container.createEmbeddedView(this.template, this);
    }
  }
}
