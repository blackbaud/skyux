import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'test-infinite-scroll-harness',
  templateUrl: './infinite-scroll-harness-test.component.html',
  standalone: false,
})
export class InfiniteScrollHarnessTestComponent {
  public enabled = input(true);

  public loading = input(false);

  public items = signal<Record<string, string>[]>([]);

  public onScrollEnd(): void {
    this.items.update((current) => {
      const len = current.length;
      const next = [...current];
      for (let i = len; i < len + 10; i++) {
        next.push({ name: `test object: #${i}` });
      }
      return next;
    });
  }
}
