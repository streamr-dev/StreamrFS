const crypto = require('crypto')

module.exports = async function encrypt({ sourceBuffer, encryptionKeyBuffer }) {
    const iv = crypto.randomBytes(16) // always need a fresh IV when using CTR mode
    const cipher = crypto.createCipheriv('aes-256-ctr', encryptionKeyBuffer, iv)

    // Prepend iv buffer to the data itself
    const encryptedBuffer = Buffer.concat([iv, cipher.update(sourceBuffer), cipher.final()])
    return encryptedBuffer
}
