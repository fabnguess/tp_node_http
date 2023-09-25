// Import Node Dependencies
import path from 'node:path';
import fs from 'node:fs';
import { stdout } from 'node:process';

// Import Third-party Dependencies
import { fetch } from 'undici';
import semver from 'semver';

function readPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const { dependencies = {}, devDependencies = {} } = packageJson;

  return { ...dependencies, ...devDependencies };
}

async function getLatestVersion(dependencies) {
  const packageNameAndVersions = Object.keys(dependencies).map(
    async (packageName) => {
      const response = await fetch(`https://registry.npmjs.org/${packageName}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      return { packageName, latestVersion: data['dist-tags'].latest };
    }
  );
  return Promise.all(packageNameAndVersions);
}

export async function listAndCheckDependencies() {
  const dependencies = readPackageJson();

  const versions = await getLatestVersion(dependencies);

  for (const { packageName, latestVersion } of versions) {
    const currentVersion = dependencies[packageName].replace(/\^/g, '');

    if (semver.major(currentVersion) < semver.major(latestVersion)) {
      stdout.write(
        `Major update available for ${packageName}: ${currentVersion} -> ${latestVersion}`
      );
    }

    if (semver.minor(currentVersion) > semver.minor(latestVersion)) {
      stdout.write(
        `Minor update available for ${packageName}: ${currentVersion} -> ${latestVersion}`
      );
    }
  }
}
