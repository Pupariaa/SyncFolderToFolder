const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');
const Metrics = require('./Metrics/Modules/Metrics');
const { eventNames } = require('process');

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
  metrics.TimerStart('event');
  var eventResult = "" 
  const relativePath = path.relative(localDir, filePath);
  const remotePath = path.join(remoteDir, relativePath);

  try {
    switch (eventType) {

      case 'add':
      case 'change':
        logCommit('> Edit/Create locale file from', filePath);
        await copyFile(filePath, remotePath);
        eventResult = "> Copied or modified remote file to"
        break;
      case 'unlink':
        logCommit('> Delete locale file from', filePath);
        await deleteFile(remotePath);
        eventResult = "> Deleted remote file to"
        break;
      case 'addDir':
        logCommit('> Edit/Create locale dir from', filePath);
        await createDir(remotePath);
        eventResult = "> Created remote dir to"
        break;
      case 'unlinkDir':
        logCommit('> Delete locale dir from', filePath);
        await deleteDir(remotePath);
        eventResult = "> Deleted remote dir to"
        break;
      default:
        console.log(`[ ${ts} ]: Unmanaged Event: ${eventType}`);
    }
  } catch (error) {
    handleError(error);
  } finally {
    logOutput(eventResult, remotePath)
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

function logCommit(commitAction, sourcePath) {
  const ts = metrics.getDate();
  console.log(`[ ${ts} ]: Commit ${commitAction} "${sourcePath}"`);
}
function logOutput(resultAction, destinationPath) {
  const ts = metrics.getDate();
  const elapsedTime = metrics.TimerStop('event');
  console.log(`[ ${ts} ]: ${resultAction} " ${destinationPath} in ${elapsedTime || 0} ms`);
}

function handleError(error) {
  const ts = metrics.getDate();
  console.error(`[ ${ts} ]: Error: ${error.message}`);
}
