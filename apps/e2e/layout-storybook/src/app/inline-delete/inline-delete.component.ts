import { AfterViewInit, Component, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-inline-delete',
  templateUrl: './inline-delete.component.html',
  styleUrls: ['./inline-delete.component.scss'],
})
export class InlineDeleteComponent implements AfterViewInit, OnDestroy {
  public readonly ready = new BehaviorSubject<boolean>(false);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ready.next(true);
    }, 300);
  }

  ngOnDestroy(): void {
    this.ready.complete();
  }
}
