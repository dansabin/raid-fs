import fs from 'fs-extra';
import { clone } from 'lodash';
import watch from 'node-watch';

import defaultConfig from '../../defaultleroyconfig.json';
import { hashMod } from '../../utils/hashmod';

const watchDirs = (dir: string, buckets: string[]) => {
  const hashingFunction = hashMod(buckets.length);
  watch(`./${dir}`, { persistent: true, recursive: true, delay: 10 }, (evt, name) => {
    console.log(`Incoming [${evt}]: ${name}`);

    const bucket = hashingFunction(name);
    const oldFilename = clone(name);
    const newFileName = clone(name).replace(dir, buckets[bucket]);

    switch (evt) {
      case 'update':
        fs.copy(oldFilename, newFileName).then(() => {
          console.log(`Completed: ${oldFilename} as ${newFileName}.`);
        });
        break;
      case 'remove':
        fs.remove(newFileName).then(() => {
          console.log(`Completed: ${newFileName} removal.`);
        });
    }
  });
};

export const execute = async (clearFlag: boolean | undefined = undefined, fileFlag: string | undefined = undefined) => {
  // Check for config files
  let config = clone(defaultConfig);

  // Check for other configs
  const configFilePath = fileFlag || './leroyconfig.json';
  if (fs.existsSync(configFilePath)) {
    const configFileBuffer = fs.readFileSync(configFilePath);
    config = JSON.parse(configFileBuffer.toString());
  }

  const dir = config.inputDirPath;
  const buckets = config.outputDirs;

  const clear = clearFlag === undefined ? config.clearOnStart || false : clearFlag;
  const removePreviousDataPromises = clear ? buckets.map(bucket => fs.remove(`${bucket}`)) : [];

  await Promise.all(removePreviousDataPromises).then(() => {
    if (clear) {
      console.log('Cleared previous data in output dirs');
    }

    if (fileFlag) {
      console.log('Using remote config: ', fileFlag);
    }

    console.log(`Watching: ${dir}`);
    watchDirs(dir, buckets);
  });
};
