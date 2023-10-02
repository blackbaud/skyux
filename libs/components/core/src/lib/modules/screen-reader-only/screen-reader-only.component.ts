import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EmbeddedViewRef,
  HostBinding,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

/**
 * @internal
 */
@Component({
  standalone: true,
  selector: 'sky-screen-reader-only',
  templateUrl: './screen-reader-only.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class SkyScreenReaderOnlyComponent {
  @HostBinding('id')
  public id = '';

  @HostBinding('class')
  public class = 'sky-screen-reader-only';

  @ViewChild('target', {
    read: ViewContainerRef,
    static: true,
  })
  public targetRef: ViewContainerRef | undefined;

  public attachTemplate<T>(
    templateRef: TemplateRef<T>,
    id: string
  ): EmbeddedViewRef<T> {
    /*istanbul ignore if: untestable*/
    if (!this.targetRef) {
      throw new Error(
        '[SkyScreenReaderComponent] Could not attach the template because the target element could not be found.'
      );
    }

    this.targetRef.clear();

    this.id = id;
    return this.targetRef.createEmbeddedView(templateRef);
  }
}
