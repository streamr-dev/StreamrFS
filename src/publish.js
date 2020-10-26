const StreamrClient = require('streamr-client')
const { urlToBuffer } = require('./utils/download-utils')
const decrypt = require('./decrypt')

module.exports = async function publish({ streamId, url, keyHex, skipVerification, streamrOptions }) {
    const options = { ...streamrOptions }
    const client = new StreamrClient(options)

    client.once('error', (err) => {
        throw new Error(`StreamrClient reported an error: ${err}`)
    })

    if (!skipVerification) {
        // Verify that the url is downloadable and decryptable
        try {
            await decrypt({
                sourceBuffer: await urlToBuffer(url),
                encryptionKeyBuffer: Buffer.from(keyHex, 'hex')
            })
        } catch (err) {
            console.error(`Verification failed! Couldn't download ${url} and decrypt with it key ${keyHex}. Publish canceled.\n`, err)
            return
        }
    }

    let stream = await client.getOrCreateStream({
        // TODO: when the backend supports human-readable stream IDs, replace the "name" line with the line below
        // id: streamId,
        name: streamId,
    })

    await client.publish(stream.id, {
        "streamrFSVersion": 1,
        url,
        key: keyHex,
    })

    await client.disconnect()

    return stream
}
