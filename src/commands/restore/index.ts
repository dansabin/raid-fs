import fs from 'fs-extra';

export const execute = () => {
    const inputDir = 'input_dir'
    const outputDirs = ['output_dir_A', 'output_dir_B', 'output_dir_C']

    const promises = outputDirs.map((dir) => {
        return fs.copy(dir, inputDir)
    })

    Promise.all(promises)
        .then(() => {
            console.log('Restore completed.')
        })
        .catch((err) => {
            console.error('FATAL: ', err)
        })
}
