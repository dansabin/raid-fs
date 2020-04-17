# RAID FS

A basic RAID 0 implementation that takes data written to one directory and writes it to multiple directories while sharding the writes.

The goal would be to use a performant disk for the main writes, while backing up the additional writes to less performant NFS disks.


## Usage

`npm start` by default will take files in `input_dir` and write it three `output_dir_x`s.

`npm start --restore` will load data from the output directories and assemble it into the input directory.

## Configuration

`npm start -f path/to/config.json` will allow you to change the parameters of which file constitutes input, output, and whether or not to erase the `inputDir` on start.

