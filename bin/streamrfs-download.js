#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const prettyBytes = require('pretty-bytes')
const download = require('../src/download')
const {
    envOptions,
    authOptions,
    exitWitHelpIfArgsNotBetween,
    formStreamrOptionsWithEnv,
} = require('./common')

program
    .usage('<streamId>')
    .description('Download a file, decrypt it, and save it to an output file')
    .option('-o, --outfile <filename>', 'Specify the decrypted output file. If not provided, the last path segment of the streamId will be used.')
    authOptions(program)
    envOptions(program)
    .version(require('../package.json').version)
    .parse(process.argv)

exitWitHelpIfArgsNotBetween(program, 1, 1)

const options = formStreamrOptionsWithEnv(program)
const streamId = program.args[0]
const streamIdSplit = streamId.split('/')
const targetFile = program.outfile || streamIdSplit[streamIdSplit.length - 1]

;(async () => {
    try {
        const decryptedBuffer = await download({
            streamId,
            targetFile,
            streamrOptions: options,
        })
        fs.writeFileSync(targetFile, decryptedBuffer)
        console.log(`Decrypted file written to ${targetFile} (${prettyBytes(decryptedBuffer.length)}).`)
    } catch (err) {
        console.error(err)
    }
})()


