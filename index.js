// Import Node Dependencies
import path from 'node:path';
import fs from 'node:fs';

// Import Third-party Dependencies
import { fetch } from 'undici';
import semver from 'semver';

export function readPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const { dependencies = {}, devDependencies = {} } = packageJson;

  return { ...dependencies, ...devDependencies };
}

export async function getLatestVersion(packageName) {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();

  return data['dist-tags'].latest;
}

export async function listAndCheckDependencies() {
  const dependencies = readPackageJson();

  for (const depName in dependencies) {
    const currentVersion = dependencies[depName].replace(/\^/g, '');
    const latestVersion = await getLatestVersion(depName);

    if (semver.major(currentVersion) < semver.major(latestVersion)) {
      console.log(
        `Major update available for ${depName}: ${currentVersion} -> ${latestVersion}`
      );
    }

    if (semver.minor(currentVersion) > semver.minor(latestVersion)) {
      console.log(
        `Minor update available for ${depName}: ${currentVersion} -> ${latestVersion}`
      );
    }
  }
}
