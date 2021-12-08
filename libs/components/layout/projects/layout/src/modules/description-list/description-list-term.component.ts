import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';

/**
 * Specifies the term in a term-description pair.
 */
@Component({
  selector: 'sky-description-list-term',
  templateUrl: './description-list-term.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDescriptionListTermComponent {
  @ViewChild('termTemplateRef', {
    read: TemplateRef,
    static: true,
  })
  public templateRef: TemplateRef<any>;
}
