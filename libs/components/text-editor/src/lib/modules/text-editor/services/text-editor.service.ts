import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { EditorSetting } from '../types/editor-setting';

/**
 * @internal
 */
@Injectable()
export class SkyTextEditorService {
  /**
   * A dictionary representing all active text editors and their settings.
   */
  public set editor(value: EditorSetting) {
    this.#editor = value;
  }

  public get editor(): EditorSetting {
    if (!this.#editor) {
      throw new Error('Editor has not been initialized.');
    }

    return this.#editor;
  }

  public get isInitialized(): boolean {
    return this.#editor !== undefined;
  }

  #editor: EditorSetting | undefined;

  /**
   * Returns the blur observable from the editor with the corresponding id.
   */
  public blurListener(): Observable<unknown> {
    return this.editor.blurObservable;
  }

  /**
   * Returns the click observable from the editor with the corresponding id.
   */
  public clickListener(): Observable<unknown> {
    return this.editor.clickObservable;
  }

  /**
   * Returns the command change observable from the editor with the corresponding id.
   */
  public commandChangeListener(): Observable<unknown> {
    return this.editor.commandChangeObservable;
  }

  /**
   * Returns the focus observable from the editor with the corresponding id.
   */
  public focusListener(): Observable<unknown> {
    return this.editor.focusObservable;
  }

  /**
   * Returns the input change observable from the editor with the corresponding id.
   */
  public inputListener(): Observable<unknown> {
    return this.editor.inputObservable;
  }

  /**
   * Returns the selection change observable from the editor with the corresponding id.
   */
  public selectionChangeListener(): Observable<unknown> {
    return this.editor.selectionChangeObservable;
  }
}
