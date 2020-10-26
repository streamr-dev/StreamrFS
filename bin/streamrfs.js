#!/usr/bin/env node
const program = require('commander')

program
    .version(require('../package.json').version)
    .usage('<command> [<args>]')
    .description('Command line tool for using StreamrFS, a file sharing extension on top of Streamr https://streamr.network')
    .command('download', 'Download and decrypt a file from StreamrFS')
    .command('encrypt', 'Encrypt a local file and persist the encryption key')
    .command('publish', 'Publish a file, or update an existing file')
    .command('decrypt', 'Decrypt an already downloaded file')
    .parse(process.argv)
