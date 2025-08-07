import { Injectable } from '@angular/core';

import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public uploadAvatar(_file: File): Observable<void> {
    // Simulate uploading the file to a web service.
    return of(undefined).pipe(delay(500));
  }
}
