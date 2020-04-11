#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import program from 'commander';
import { init, restore, exec } from './commands'

clear();

console.log(
    chalk.red(figlet.textSync('Leroy - Raid File System', { horizontalLayout: 'full' }))
)

program
    .version('1.0.0')
    .description("A RAID implementation running on NodeJS")
    .option('-d, --daemon', 'Run as Daemon')
    .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
    .option('-C, --no-cheese', 'You do not want any cheese')

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
    .command('watch')
    .description('stripes from current dir')
    .action(() => {
        exec.execute()
    })


// Default to help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

// Run
program
    .parse(process.argv);
