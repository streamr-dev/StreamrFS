#!/usr/bin/env node
const program = require('commander')
const fs = require('fs')
const prettyBytes = require('pretty-bytes');
const decrypt = require('../src/decrypt')
const {
    envOptions,
    authOptions,
    exitWitHelpIfArgsNotBetween,
} = require('./common')

program
    .usage('<local-file> <key-hex> <outfile>')
    .description('Decrypt a local file with a symmetric AES key')
    authOptions(program)
    envOptions(program)
    .version(require('../package.json').version)
    .parse(process.argv)

exitWitHelpIfArgsNotBetween(program, 3, 3)

const encryptedFileName = program.args[0]
const keyHex = program.args[1]
const outFileName = program.args[2]

;(async () => {
    const sourceBuffer = fs.readFileSync(encryptedFileName)
    const encryptionKeyBuffer = Buffer.from(keyHex, 'hex')
    try {
        console.log(`Decrypting file ${encryptedFileName} (${prettyBytes(sourceBuffer.length)})...`)
        const decryptedBuffer = await decrypt({
            sourceBuffer,
            encryptionKeyBuffer,
        })
        fs.writeFileSync(outFileName, decryptedBuffer)
        console.log(`File decrypted:\n  - Output file: ${outFileName} (${prettyBytes(decryptedBuffer.length)})\n`)
    } catch (err) {
        console.error(err)
    }
})()
