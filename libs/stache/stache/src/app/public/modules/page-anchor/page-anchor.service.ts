import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject,
  Subject
} from 'rxjs';

import {
  pairwise,
  map,
  takeUntil
} from 'rxjs/operators';

import {
  StacheNavLink
} from '../nav/nav-link';

import {
  StacheWindowRef
} from '../shared/window-ref';

@Injectable()
export class StachePageAnchorService implements OnDestroy {
  public pageAnchorsStream = new Subject <StacheNavLink[]>();
  public pageAnchors: BehaviorSubject<StacheNavLink>[] = [];
  public refreshRequestedStream = new Subject();
  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private windowRef: StacheWindowRef
  ) {
    this.windowRef.scrollEventStream
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(e => this.windowRef.nativeWindow.document.body.scrollHeight),
        pairwise()
      )
      .subscribe(height => {
        if (height[0] !== height[1]) {
          this.refreshAnchors();
        }
      });
  }

  public addAnchor(anchorStream: BehaviorSubject<StacheNavLink>) {
    anchorStream
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe({
        next: () => {
          this.updateAnchorStream();
        },
        complete: () => {
          this.removeAnchor(anchorStream.getValue());
        }
      });

    this.pageAnchors.push(anchorStream);
    this.updateAnchorStream();
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public refreshAnchors() {
    this.refreshRequestedStream.next();
  }

  private removeAnchor(removedAnchor: StacheNavLink) {
    this.pageAnchors = this.pageAnchors.filter((anchor: BehaviorSubject<StacheNavLink>) => {
      return anchor.getValue().name !== removedAnchor.name;
    });
  }

  private updateAnchorStream() {
    this.pageAnchors.sort(this.sortPageAnchors);
    this.pageAnchorsStream.next(
      this.pageAnchors.map(anchor => anchor.getValue())
    );
  }

  private sortPageAnchors(
    anchorA: BehaviorSubject<StacheNavLink>,
    anchorB: BehaviorSubject<StacheNavLink>
  ) {
    return anchorA.getValue().offsetTop - anchorB.getValue().offsetTop;
  }
}
