const fs = require('fs');
const path = require('path');

const isGitRepo = fs.existsSync(path.join(__dirname, '..', '.git'));

if (isGitRepo) {
  console.log('Development mode - skipping prepare');
  process.exit(0);
}

const sourcePath = path.join(__dirname, '..', 'packages', 'core', 'package.json');
const destPath = path.join(__dirname, '..', 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  packageJson.name = 'vuedi';

  fs.writeFileSync(destPath, JSON.stringify(packageJson, null, 2));

  console.log('Copied and renamed package.json to "vuedi" for git installation');
} catch (error) {
  console.error('Failed to prepare package.json:', error.message);
  process.exit(1);
}
