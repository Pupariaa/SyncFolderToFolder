# Folder Sync with Chokidar
## Overview

This Node.js script uses Chokidar to monitor changes in a local folder and synchronizes those changes to a corresponding remote folder. The script can handle file additions, modifications, deletions, directory additions, and directory deletions.

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.

## Setup

1. Clone this repository to your local machine.

2. Open a terminal and navigate to the repository's directory.


Modify the localDir and remoteDir variables in the script to point to your source and destination folders:
  ```js
    const localDir = 'C:/Users/USER/Documents/Dev/'; // The source folder
    const remoteDir = 'C:/Users/USER/Documents/Dev/'; // The destination folder (the one that will be synced)
  ```
 ## Usage
Run the script using the following command:

 ```bash
  node index.js
  ```

The script will start monitoring the specified local folder (localDir). When changes occur (additions, modifications, deletions), it will automatically synchronize those changes to the corresponding remote folder (remoteDir).

## Supported Events
File Additions/Modifications: When a file is added or modified in the local folder, the script copies or modifies the corresponding file in the remote folder.

File Deletions: When a file is deleted in the local folder, the script deletes the corresponding file in the remote folder.

Directory Additions: When a new directory is added in the local folder, the script creates the corresponding directory in the remote folder.

Directory Deletions: When a directory is deleted in the local folder,
