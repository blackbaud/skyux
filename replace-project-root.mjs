#!/usr/bin/env node
import fg from 'fast-glob';
import { readFile, writeFile } from 'fs/promises';
import { relative, resolve } from 'path';

const workspaceRoot = '/Users/steve.brush/Projects/skyux_main';

async function replaceProjectRootInFile(filePath) {
  try {
    // Read the file
    const content = await readFile(filePath, 'utf8');

    // Calculate the relative path from workspace root to the directory containing project.json
    const projectDir = resolve(filePath, '..');
    const relativePath = relative(workspaceRoot, projectDir);

    // Replace {projectRoot} with the actual relative path
    const updatedContent = content.replace(/\{projectRoot\}/g, relativePath);

    // Only write if there were changes
    if (content !== updatedContent) {
      await writeFile(filePath, updatedContent, 'utf8');
      console.log(`Updated: ${relativePath}/project.json`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

async function main() {
  try {
    // Find all project.json files in the libs directory
    const projectFiles = await fg('libs/**/project.json', {
      cwd: workspaceRoot,
      absolute: true,
    });

    console.log(
      `Found ${projectFiles.length} project.json files in libs directory`,
    );

    let updatedCount = 0;

    // Process each file
    for (const filePath of projectFiles) {
      const wasUpdated = await replaceProjectRootInFile(filePath);
      if (wasUpdated) {
        updatedCount++;
      }
    }

    console.log(`\nCompleted! Updated ${updatedCount} files.`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
