import { JsonObject, logging } from '@angular-devkit/core';
import { SchematicContext } from '@angular-devkit/schematics';

const loggedMessages: Set<string> = new Set<string>();

export function logOnce(
  context: SchematicContext,
  level: logging.LogLevel,
  message: string,
  metadata: JsonObject = {},
): void {
  if (!loggedMessages.has(message)) {
    context.logger.log(level, message, metadata);
    loggedMessages.add(message);
  }
}
