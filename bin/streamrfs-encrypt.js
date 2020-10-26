#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const crypto = require('crypto')
const prettyBytes = require('pretty-bytes');
const encrypt = require('../src/encrypt')
const {
    envOptions,
    authOptions,
    exitWitHelpIfArgsNotBetween,
} = require('./common')

program
    .usage('<local-file>')
    .description('Encrypt a local file with a symmetric AES key')
    .option('-k, --key <key-hex>', 'Provide a key to encrypt with. If not provided, a key will be generated.')
    .option('-o, --outfile <filename>', 'Specify the encrypted output file. If not provided, ".enc" will be appended to the source filename.')
    authOptions(program)
    envOptions(program)
    .version(require('../package.json').version)
    .parse(process.argv)

exitWitHelpIfArgsNotBetween(program, 1, 1)

;(async () => {
    const sourceBuffer = fs.readFileSync(program.args[0])
    const encryptionKeyBuffer = program.key ? Buffer.from(program.key, 'hex') : crypto.randomBytes(32)
    try {
        console.log(`Encrypting file ${program.args[0]} (${prettyBytes(sourceBuffer.length)})...`)
        const encryptedBuffer = await encrypt({
            sourceBuffer,
            encryptionKeyBuffer,
        })
        const outFile = program.outfile || program.args[0] + '.enc'
        const keyHex = encryptionKeyBuffer.toString('hex')
        fs.writeFileSync(outFile, encryptedBuffer)
        console.log(`File encrypted:\n  - Output file: ${outFile} (${prettyBytes(encryptedBuffer.length)})\n  - Encryption key: ${keyHex}\n`)
        console.log(`Now please upload the file to some public url, and then publish the file to a stream with:\n\n    streamrfs publish <streamId> <url> ${keyHex}\n`)
    } catch (err) {
        console.error(err)
    }
})()
