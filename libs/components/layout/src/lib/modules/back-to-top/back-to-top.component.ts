import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Observable, Subject } from 'rxjs';

/**
 * @internal
 */
@Component({
  selector: 'sky-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkyBackToTopComponent {
  public get scrollToTopClick(): Observable<void> {
    return this.#_scrollToTopClick.asObservable();
  }

  #_scrollToTopClick = new Subject<void>();

  public onScrollToTopClick(): void {
    this.#_scrollToTopClick.next();
    this.#_scrollToTopClick.complete();
  }
}
