#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import program from 'commander';
import {exec, init, restore} from './commands'

clear();

console.log(
    chalk.red(figlet.textSync('Leroy raids all the things!'))
)

program
    .version('1.0.0')
    .description("A RAID implementation running on NodeJS")
    .option('-d, --debug', "Leroy attempts to communicate his primary directive.")
    .option('-c, --clear', "Leroy deliberately wipes the entire group.")
    .option('-f, --file <path/to/config>', "Tell Leroy where the loot is, otherwise he won't look too hard and assume he knows best.")

program
    .command('init')
    .description('creates a config file')
    .action(() => {
        init.execute()
    })
program
    .command('restore')
    .description('restores to current dir')
    .action(() => {
        restore.execute()
    })
program
    .command('watch', {isDefault: true})
    .description('stripes from current dir')
    .action(() => {
        exec.execute(program.clear, program.file)
    })

// Run
program
    .parse(process.argv);

if (program.debug) console.log(program.opts());
