import { readFileSync } from 'node:fs';

export function readPercyBuildNumberFromLogString(
  log: string,
): string | undefined {
  const buildIdCheck = '[percy] Finalized build';
  if (!log.includes(buildIdCheck)) {
    return undefined;
  }
  const buildIdStart = log.indexOf(buildIdCheck);
  const buildIdEol = log.indexOf(`\n`, buildIdStart);
  const buildIdLine = log.substring(buildIdStart, buildIdEol);
  return String(buildIdLine.split('/').pop()).trim();
}

export function readPercyBuildNumberFromLogFile(
  logFilePath: string,
): string | undefined {
  try {
    const logContent = readFileSync(logFilePath, 'utf-8');
    return readPercyBuildNumberFromLogString(logContent);
  } catch (error) {
    console.error(`Error reading log file ${logFilePath}:`, error);
    return undefined;
  }
}
