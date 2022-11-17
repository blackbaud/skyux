import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FontLoadingTestingService {
  public ready(): Observable<boolean> {
    return new BehaviorSubject(true);
  }
}
