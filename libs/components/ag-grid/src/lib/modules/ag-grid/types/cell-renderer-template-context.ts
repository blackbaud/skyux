/**
 * The context provided to the template of a template cell renderer.
 */
export interface SkyCellRendererTemplateContext {
  /**
   * The cell's value.
   */
  value: unknown;
  /**
   * The row's data.
   */
  row: object | undefined;
}
