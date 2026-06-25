import { Component } from '@angular/core';

@Component({
  selector: 'test-infinite-scroll-harness',
  templateUrl: './infinite-scroll-harness-test.component.html',
  standalone: false,
})
export class InfiniteScrollHarnessTestComponent {
  public enabled = true;

  public loading = false;

  public items: Record<string, string>[] = [];

  public onScrollEnd(): void {
    const len = this.items.length;
    for (let i = len; i < len + 10; i++) {
      this.items.push({
        name: `test object: #${i}`,
      });
    }
  }
}
