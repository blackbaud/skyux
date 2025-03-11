import { Component } from '@angular/core';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  standalone: false,
})
export class InfiniteScrollComponent {
  public enabled = true;
  public loading = false;
  public items: string[] = ['Rory', 'River', 'Amy', 'Clara'];
  public scrollableParent = false;
}
