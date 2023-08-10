// Adding this environment variable works the same as passing `--dry-run` to the generator.
// It prevents the generator from running e.g. the `npm install` command.
process.env['NX_DRY_RUN'] = 'true';
