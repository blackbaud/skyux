import {
  Subject
} from 'rxjs';

/**
 * @internal
 */
export interface EditorSetting {
  clickObservable: Subject<unknown>;
  commandChangeObservable: Subject<unknown>;
  iframeElementRef: HTMLIFrameElement;
  selectionChangeObservable: Subject<unknown>;
  clickListener: () => void;
  selectionListener: () => void;
  pasteListener: (e: ClipboardEvent) => void;
}
