/**
 * Represents options passed via Angular CLI.
 */
export interface Schema {
  /**
   * The path to the files where the rule should be applied.
   */
  projectPath: string;

  /**
   * Whether to eagerly migrate as much as possible, ignoring problematic patterns that would otherwise prevent migration.
   */
  bestEffortMode: boolean;

  /**
   * Whether to insert todos for any items that could not be migrated or that require manual review.
   */
  insertTodos: boolean;
}
