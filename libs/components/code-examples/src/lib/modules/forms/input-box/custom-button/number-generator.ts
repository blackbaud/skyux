import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormsInputBoxNumberGenerator {
  public generate(): number {
    return Math.floor(Math.random() * 1000000);
  }
}
