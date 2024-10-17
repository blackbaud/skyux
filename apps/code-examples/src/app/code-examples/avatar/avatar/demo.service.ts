import { Injectable } from '@angular/core';

import { Observable, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  public uploadAvatar(file: File): Observable<void> {
    // Simulate uploading the file to a web service.
    return of(undefined).pipe(delay(500));
  }
}
