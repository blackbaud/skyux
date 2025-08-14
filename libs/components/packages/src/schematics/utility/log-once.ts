import { JsonObject } from '@angular-devkit/core';
import { LogLevel } from '@angular-devkit/core/src/logger/logger';
import { SchematicContext } from '@angular-devkit/schematics';

const loggedMessages: Set<string> = new Set<string>();

export function logOnce(
  context: SchematicContext,
  level: LogLevel,
  message: string,
  metadata: JsonObject = {},
): void {
  if (!loggedMessages.has(message)) {
    context.logger.log(level, message, metadata);
    loggedMessages.add(message);
  }
}
