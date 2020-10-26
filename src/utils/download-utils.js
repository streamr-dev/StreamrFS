const fetch = require('node-fetch')

async function messageToBuffer(message) {
    if (!message.streamrFSVersion || !message.url) {
        throw new Error(`Message doesn't look like a StreamrFS message: ${JSON.stringify(message)}`)
    } else {
        return urlToBuffer(message.url)
    }
}

async function urlToBuffer(url) {
    if (url.startsWith('http')) {
        const response = await fetch(url)
        return response.buffer()
    } else {
        throw new Error(`Unsupported protocol: ${url}`)
    }
}

module.exports = {
    messageToBuffer,
    urlToBuffer,
}
