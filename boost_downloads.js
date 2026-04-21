const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PACKAGE_NAME = 'bitcoin-native-alee';
const TARGET_DOWNLOADS = 500;
const CONCURRENCY = 5;

let completed = 0;
let errors = 0;

console.log(`Starting download boost for ${PACKAGE_NAME}... Target: ${TARGET_DOWNLOADS}`);

function installPackage(index) {
  return new Promise((resolve) => {
    // We use a temporary directory for each install to avoid conflicts
    const tempDir = path.join(__dirname, `.temp_install_${index}`);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Disable caching and audit to try and force a real download if possible,
    // though npm still limits stats per IP.
    exec(`cd ${tempDir} && npm install ${PACKAGE_NAME} --no-cache --no-audit --no-fund`, (error) => {
      if (error) {
        errors++;
        console.error(`Status: Error on download ${completed + errors}`);
      } else {
        completed++;
        console.log(`Status: ${completed}/${TARGET_DOWNLOADS} downloads initiated successfully.`);
      }
      
      // Cleanup
      fs.rm(tempDir, { recursive: true, force: true }, () => {
        resolve();
      });
    });
  });
}

async function runBatches() {
  const currentBatch = [];
  
  for (let i = 0; i < TARGET_DOWNLOADS; i++) {
    currentBatch.push(installPackage(i));
    
    if (currentBatch.length >= CONCURRENCY || i === TARGET_DOWNLOADS - 1) {
      await Promise.all(currentBatch);
      currentBatch.length = 0; // clear batch
    }
  }
  
  console.log(`\nCompleted! Initiated ${completed} successful installs. (${errors} errors)`);
  console.log('Note: NPM limits unique downloads per IP address. You may need to use proxies for authentic statistics.');
}

runBatches().catch(console.error);
