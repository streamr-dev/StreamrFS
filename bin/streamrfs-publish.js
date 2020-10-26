#!/usr/bin/env node
const program = require('commander')
const publish = require('../src/publish')
const {
    envOptions,
    authOptions,
    exitWitHelpIfArgsNotBetween,
    formStreamrOptionsWithEnv,
} = require('./common')

program
    .usage('<streamId> <url-to-file> <key-hex>')
    .description('Publish a file, or publish a new version of a file')
    .option('-s, --skip-verify', 'Skip verification (downloading and decrypting) the file before publishing')
    authOptions(program)
    envOptions(program)
    .version(require('../package.json').version)
    .parse(process.argv)

exitWitHelpIfArgsNotBetween(program, 3, 3)

const options = formStreamrOptionsWithEnv(program)

;(async () => {
    try {
        await publish({
            streamId: program.args[0],
            url: program.args[1],
            keyHex: program.args[2],
            skipVerification: program['skip-verify'],
            streamrOptions: options,
        })
        console.log(`File successfully published to stream: ${program.args[0]}`)
    } catch (err) {
        console.error(err)
    }
})()
