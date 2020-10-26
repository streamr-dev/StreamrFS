const StreamrClient = require('streamr-client')
const decrypt = require('./decrypt')
const { messageToBuffer } = require('./utils/download-utils')

module.exports = async function download({ streamId, targetFile, streamrOptions }) {
    const options = { ...streamrOptions }
    const client = new StreamrClient(options)

    // TODO: when the backend supports human-readable stream IDs, the stream fetching can be removed and the id given to resend() directly
    let stream = await client.getOrCreateStream({
        name: streamId,
    })

    // Get the latest message
    const latest = await new Promise(async (resolve, reject) => {
        const sub = await client.resend({
            stream: stream.id,
            resend: {
                last: 1,
            },
        }, (msg) => {
            resolve(msg)
        })
        sub.once('no_resend', () => reject(`Could not get the latest message in stream ${streamId}`))
    })
    await client.disconnect()

    const encryptedBuffer = await messageToBuffer(latest)
    const encryptionKeyBuffer = Buffer.from(latest.key, 'hex')
    return decrypt({
        sourceBuffer: encryptedBuffer,
        encryptionKeyBuffer,
    })
}
