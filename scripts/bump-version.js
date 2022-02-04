/* eslint-disable no-console */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, '../app.version.json');
const encoding = 'utf-8';

const file = fs.readFileSync(pathFile, encoding);
const jsonFile = JSON.parse(file);

const [major, minor, patch] = jsonFile.version.split('.');
const args = process.argv.slice(2);

console.log('\x1b[33m%s\x1b[0m', '-- BUMP VERSION SCRIPT STARTED --');

if (args.includes('--patch')) {
  jsonFile.version = `${major}.${minor}.${Number(patch) + 1}`;
}

if (args.includes('--minor')) {
  jsonFile.version = `${major}.${Number(minor) + 1}.0`;
}

if (args.includes('--major')) {
  jsonFile.version = `${Number(major) + 1}.0.0`;
}

jsonFile.build = String(Number(jsonFile.build) + 1);

// ----- //

try {
  fs.writeFileSync(pathFile, JSON.stringify(jsonFile, null, 2), encoding);
  console.log(
    '\x1b[32m%s\x1b[0m',
    `-- BUMPED VERSION WITH SUCCESS - (${jsonFile.build}) ${jsonFile.version} --`,
  );
} catch (error) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    'SOMETHING WENT WRONG - ERROR BUMPING VERSION',
  );

  process.exit(1);
}

// ----- //

if (args.includes('--push')) {
  try {
    execSync(
      `git config --global user.name "Natoora CI Bot" && ` +
        `git config --global user.email "ci.bot@natoora.com" && ` +
        `git add -A && ` +
        `git commit -m "Bump HD App Version: (${jsonFile.build}) ${jsonFile.version}" && ` +
        `git push origin $(git symbolic-ref --short -q HEAD)`,
    );

    console.log(
      '\x1b[32m%s\x1b[0m',
      `-- COMMIT PUSHED WITH SUCCESS - (${jsonFile.build}) ${jsonFile.version} --`,
    );
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'SOMETHING WENT WRONG - ERROR GENERATING RELEASE',
    );

    process.exit(1);
  }
}

// ----- //

if (args.includes('--release-tag')) {
  try {
    execSync(
      `git config --global user.name "Natoora CI Bot" && ` +
        `git config --global user.email "ci.bot@natoora.com" && ` +
        `git tag -a "hd-${jsonFile.version}" -m "HD App Version: (${jsonFile.build}) ${jsonFile.version}" && ` +
        `git push origin "hd-${jsonFile.version}"`,
    );

    console.log(
      '\x1b[32m%s\x1b[0m',
      `-- TAG PUSHED WITH SUCCESS - hd-${jsonFile.version} --`,
    );
  } catch (error) {
    console.error(
      '\x1b[31m%s\x1b[0m',
      'SOMETHING WENT WRONG - ERROR GENERATING TAG',
    );

    process.exit(1);
  }
}
