import { Subject } from 'rxjs';

/**
 * @internal
 */
export interface EditorSetting {
  blurListener: () => void;

  blurObservable: Subject<void>;

  focusListener: () => void;

  focusObservable: Subject<void>;

  clickListener: () => void;

  clickObservable: Subject<void>;

  commandChangeObservable: Subject<void>;

  iframeElementRef: HTMLIFrameElement;

  inputListener: () => void;

  inputObservable: Subject<void>;

  pasteListener: (e: ClipboardEvent) => void;

  selectionChangeObservable: Subject<void>;

  selectionListener: () => void;
}
