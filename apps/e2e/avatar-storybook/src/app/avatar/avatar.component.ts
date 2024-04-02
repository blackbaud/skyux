import { AfterViewInit, Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements AfterViewInit {
  public name = 'Robert C. Hernandez';

  protected readonly ready = new BehaviorSubject(false);

  public ngAfterViewInit(): void {
    setTimeout(() => this.ready.next(true), 400);
  }
}
