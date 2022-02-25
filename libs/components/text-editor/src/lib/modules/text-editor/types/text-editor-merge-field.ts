export interface SkyTextEditorMergeField {
  /**
   * Specifies an identifier for the merge field.
   */
  id: string;

  /**
   * Specifies display text for the merge field. If it is more than 18 characters, the component truncates to 15 characters.
   */
  name: string;

  /**
   * Specifies the `src` attribute for a preview image to represent the merge field
   * in the text editor. By default, the `name` value appears in a blue rectangle.
   */
  previewImageUrl?: string;
}
