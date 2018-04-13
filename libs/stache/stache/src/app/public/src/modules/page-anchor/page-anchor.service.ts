import { Injectable} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { StacheNavLink } from '../nav';

@Injectable()
export class StachePageAnchorService {

  private anchor = new Subject<StacheNavLink>();
  public anchorStream: Observable<StacheNavLink> = this.anchor.asObservable();

  public addPageAnchor(anchor: StacheNavLink) {
    this.anchor.next(anchor);
  }
}
