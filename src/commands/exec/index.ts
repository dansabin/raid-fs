import watch from 'node-watch';
import fs from 'fs-extra';
import hashmod from 'hash-mod'
import { clone } from 'lodash'
import program from 'commander';

import defaultConfig from '../../defaultleroyconfig.json'

const watchDirs = (dir: string, buckets: string[]) => {
    const hashingFunction = hashmod(buckets.length);
    watch(`./${dir}`, { persistent: true, recursive: true, delay: 10 }, (evt, name) => {
        console.log(`Incoming [${evt}]: ${name}`);

        const bucket = hashingFunction(name);
        const oldFilename = clone(name);
        const newFileName = clone(name).replace(dir, buckets[bucket]);

        switch (evt) {
            case 'update':
                fs.copy(oldFilename, newFileName)
                    .then(() => {
                        console.log(`Completed: ${oldFilename} as ${newFileName}.`);
                    })
                break;
            case 'remove':
                fs.remove(newFileName)
                    .then(() => {
                        console.log(`Completed: ${newFileName} removal.`);
                    })
        }

    })
}

export const execute = (clear = false, file: string | undefined = undefined) => {
    // Check for config files
    let config = clone(defaultConfig);

    // Check for other configs
    const configFilePath = program.file || './leroyconfig.json'
    if (fs.existsSync(configFilePath)) {
        const configFileBuffer = fs.readFileSync(configFilePath);
        config = JSON.parse(configFileBuffer.toString());
    }

    const dir = config.inputDirPath
    const buckets = config.outputDirs

    const removePreviousDataPromises = clear ?
        buckets.map((bucket) => {
            return fs.remove(`${bucket}`)
        }) :
        [Promise.resolve()];

    Promise.all(removePreviousDataPromises)
        .then(() => {
            if (clear) {
                console.log('cleared previous data in output dirs')
            }

            if (file) {
                console.log('Using remote config: ', file)
            }

            console.log(`Watching: ${dir}`);
            watchDirs(dir, buckets)
        })

}
