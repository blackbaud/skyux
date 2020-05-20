import {
  Component,
  ViewChild
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  SkyProgressIndicatorActionClickArgs,
  SkyProgressIndicatorMessage
} from '../types';

import {
  SkyProgressIndicatorComponent
} from '../progress-indicator.component';

@Component({
  selector: 'sky-progress-indicator-progress-handler-fixture',
  templateUrl: './progress-indicator-progress-handler.component.fixture.html'
})
export class SkyProgressIndicatorProgressHandlerFixtureComponent {

  @ViewChild(SkyProgressIndicatorComponent, {
    static: true
  })
  public progressIndicator: SkyProgressIndicatorComponent;

  public isLoading = false;

  public messageStream = new Subject<SkyProgressIndicatorMessage>();

  public onFinishClick(args: SkyProgressIndicatorActionClickArgs): void {
    // Simulate an asynchronous call.
    this.isLoading = true;
    setTimeout(() => {
      args.progressHandler.advance();
      this.isLoading = false;
    });
  }

  public sendMessage(message: SkyProgressIndicatorMessage): void {
    this.messageStream.next(message);
  }

}
