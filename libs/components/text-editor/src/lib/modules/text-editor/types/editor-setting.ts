import { Subject } from 'rxjs';

/**
 * @internal
 */
export interface EditorSetting {
  blurListener: () => void;

  blurObservable: Subject<unknown>;

  clickListener: () => void;

  clickObservable: Subject<unknown>;

  commandChangeObservable: Subject<unknown>;

  iframeElementRef: HTMLIFrameElement;

  inputListener: () => void;

  inputObservable: Subject<unknown>;

  pasteListener: (e: ClipboardEvent) => void;

  selectionChangeObservable: Subject<unknown>;

  selectionListener: () => void;
}
