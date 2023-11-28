const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');
const Metrics = require('./Metrics/Modules/Metrics');

const localDir = 'C:/Users/USER/Documents/Dev/'; //The source folder
const remoteDir = 'C:/Users/USER/Documents/Dev/'; //The destination folder (the one that will be sync)

const watcher = chokidar.watch(localDir, { ignored: /(^|[\/\\])\../, persistent: true, ignoreInitial: true });
const metrics = new Metrics();

watcher
  .on('add', filePath => handleFileChange('add', filePath))
  .on('change', filePath => handleFileChange('change', filePath))
  .on('unlink', filePath => handleFileChange('unlink', filePath))
  .on('addDir', dirPath => handleFileChange('addDir', dirPath))
  .on('unlinkDir', dirPath => handleFileChange('unlinkDir', dirPath));

async function handleFileChange(eventType, filePath) {
  const ts = metrics.getDate();
  console.log(`[ ${ts} ]: New Task`);
  metrics.TimerStart('event');

  const relativePath = path.relative(localDir, filePath);
  const remotePath = path.join(remoteDir, relativePath);

  try {
    switch (eventType) {
      case 'add':
      case 'change':
        logCommit('Edit/Create Locale File', filePath, 'Copied', remotePath);
        await copyFile(filePath, remotePath);
        break;
      case 'unlink':
        logCommit('Delete Locale File', filePath, 'File Deleted', remotePath);
        await deleteFile(remotePath);
        break;
      case 'addDir':
        logCommit('Edit/Create Locale Path', filePath, 'Dir Created', remotePath);
        await createDir(remotePath);
        break;
      case 'unlinkDir':
        logCommit('Delete Locale Path', filePath, 'Dir Deleted', remotePath);
        await deleteDir(remotePath);
        break;
      default:
        console.log(`[ ${ts} ]: Unmanaged Event: ${eventType}`);
    }
  } catch (error) {
    handleError(error);
  } finally {
    const elapsedTime = metrics.TimerStop('event');
    logFinishedTask(elapsedTime);
  }
}

async function copyFile(sourcePath, destinationPath) {
  await fs.copyFile(sourcePath, destinationPath);
}

async function deleteFile(filePath) {
  await fs.unlink(filePath);
}

async function createDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function deleteDir(dirPath) {
  await fs.rm(dirPath, { recursive: true });
}

function logCommit(commitAction, sourcePath, resultAction, destinationPath) {
  const ts = metrics.getDate();
  console.log(`[ ${ts} ]: Commit from: ${commitAction} "${sourcePath}"`);
  console.log(`[ ${ts} ]: Commit to: ${resultAction}: ${destinationPath}`);
}

function handleError(error) {
  const ts = metrics.getDate();
  console.error(`[ ${ts} ]: Error: ${error.message}`);
}

function logFinishedTask(elapsedTime) {
  const ts = metrics.getDate();
  console.log(`[ ${ts} ]: Finished Task in ${elapsedTime} ms`);
}