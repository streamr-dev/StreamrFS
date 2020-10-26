const crypto = require('crypto')

module.exports = function decrypt({ sourceBuffer, encryptionKeyBuffer }) {
    // iv is first 16 bytes
    const iv = sourceBuffer.subarray(0, 16)
    const encryptedBuffer = sourceBuffer.subarray(16)

    // TODO: AES-CTR always succeeds even if the key is wrong. Would be nicer if we used a scheme that throws if the key is wrong.
    const decipher = crypto.createDecipheriv('aes-256-ctr', encryptionKeyBuffer, iv)
    return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()])
}
