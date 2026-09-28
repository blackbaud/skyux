import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DropdownItemsService {
  public getItems(): Promise<string[]> {
    return new Promise((resolve) => {
      // Simulate network latency.
      setTimeout(() => {
        resolve(['Option 1', 'Option 2']);
      }, 1000);
    });
  }
}
