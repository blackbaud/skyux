import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { SkyModalCloseArgs, SkyModalService } from '@skyux/modals';
import {
  SkyProgressIndicatorChange,
  SkyProgressIndicatorMessage,
  SkyProgressIndicatorMessageType,
  SkyProgressIndicatorModule,
} from '@skyux/progress-indicator';

import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { ModalContext } from './modal-context';
import { ModalComponent } from './modal.component';

/**
 * @title Waterfall progress indicator
 */
@Component({
  selector: 'app-progress-indicator-waterfall-indicator-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyProgressIndicatorModule],
})
export class ProgressIndicatorWaterfallIndicatorBasicExampleComponent {
  protected activeIndex: number | undefined = 0;

  protected progressMessageStream = new Subject<
    SkyProgressIndicatorMessage | SkyProgressIndicatorMessageType
  >();

  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #modalSvc = inject(SkyModalService);

  protected configureConnection(isProgress: boolean): void {
    this.#openModalForm(
      {
        title: 'Configure connection',
        buttonText: 'Submit connection settings',
      },
      isProgress,
    );
  }

  protected setServer(isProgress: boolean): void {
    this.#openModalForm(
      {
        title: 'Select remote server',
        buttonText: 'Submit server choice',
      },
      isProgress,
    );
  }

  protected testConnection(isProgress: boolean): void {
    this.#openModalForm(
      {
        title: 'Connection confirmed.',
        buttonText: 'OK',
      },
      isProgress,
    );
  }

  protected alertMessage(message: string): void {
    alert(message);
  }

  protected updateIndex(changes: SkyProgressIndicatorChange): void {
    this.activeIndex = changes.activeIndex;
    this.#changeDetectorRef.detectChanges();
  }

  protected resetClicked(): void {
    this.progressMessageStream.next(SkyProgressIndicatorMessageType.Reset);
  }

  private progress(): void {
    this.progressMessageStream.next(SkyProgressIndicatorMessageType.Progress);
  }

  #openModalForm(context: ModalContext, isProgress: boolean): void {
    const modalForm = this.#modalSvc.open(ModalComponent, [
      {
        provide: ModalContext,
        useValue: context,
      },
    ]);

    modalForm.closed.pipe(take(1)).subscribe((args: SkyModalCloseArgs) => {
      if (args.reason === 'save' && isProgress) {
        this.progress();
      }
    });
  }
}
