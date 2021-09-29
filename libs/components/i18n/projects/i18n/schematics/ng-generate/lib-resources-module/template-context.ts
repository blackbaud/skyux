export interface TemplateContext {
  /**
   * The name of the module provided to the 'ng generate' command.
   */
  modulePath: string;

  /**
   * The class name prefix.
   */
  name: string;

  /**
   * A stringified object representing all resource messages.
   */
  resources: string;
}
