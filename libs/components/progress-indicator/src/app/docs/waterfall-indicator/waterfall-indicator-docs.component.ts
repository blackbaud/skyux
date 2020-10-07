import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import {
  SkyModalService,
  SkyModalCloseArgs
} from '@skyux/modals';

import {
  SkyProgressIndicatorChange,
  SkyProgressIndicatorMessageType
} from '@skyux/progress-indicator';

import {
  Subject
} from 'rxjs';

import {
  take
} from 'rxjs/operators';

import {
  ProgressIndicatorWaterfallDemoContext
} from './progress-indicator-waterfall-demo-context';

import {
  ProgressIndicatorWaterfallDemoFormComponent
} from './progress-indicator-waterfall-demo-form.component';

@Component({
  selector: 'app-waterfall-indicator-docs',
  templateUrl: './waterfall-indicator-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WaterfallIndicatorDocsComponent {

  public activeIndex = 0;

  public progressMessageStream = new Subject<SkyProgressIndicatorMessageType>();

  constructor(
    private changeDetector: ChangeDetectorRef,
    private modal: SkyModalService
  ) { }

  public configureConnection(isProgress: boolean): void {
    this.openModalForm(
      {
        title: 'Configure connection',
        buttonText: 'Submit connection settings'
      },
      isProgress
    );
  }

  public setServer(isProgress: boolean): void {
    this.openModalForm(
      {
        title: 'Select remote server',
        buttonText: 'Submit server choice'
      },
      isProgress
    );
  }

  public testConnection(isProgress: boolean): void {
    this.openModalForm(
      {
        title: 'Connection confirmed.',
        buttonText: 'OK'
      },
      isProgress
    );
  }

  public alertMessage(message: string): void {
    alert(message);
  }

  public updateIndex(changes: SkyProgressIndicatorChange): void {
    this.activeIndex = changes.activeIndex;
    this.changeDetector.detectChanges();
  }

  public resetClicked(): void {
    this.progressMessageStream.next(SkyProgressIndicatorMessageType.Reset);
  }

  private progress(): void {
    this.progressMessageStream.next(SkyProgressIndicatorMessageType.Progress);
  }

  private openModalForm(context: ProgressIndicatorWaterfallDemoContext, isProgress: boolean): void {
    const modalForm = this.modal.open(ProgressIndicatorWaterfallDemoFormComponent, [{
      provide: ProgressIndicatorWaterfallDemoContext,
      useValue: context
    }]);

    modalForm.closed.pipe(take(1)).subscribe((args: SkyModalCloseArgs) => {
      if (args.reason === 'save' && isProgress) {
        this.progress();
      }
    });
  }

}
