import watch from 'node-watch';
import fs from 'fs-extra';
import hashmod from 'hash-mod'
import { clone } from 'lodash'

export const execute = () => {
    const dir = 'input_dir'
    const buckets = ['output_dir_A', 'output_dir_B', 'output_dir_C']
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
