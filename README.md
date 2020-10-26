# StreamrFS

**Warning: Insecure at the moment! To be secure, a version of the Streamr JS client that supports end-to-end encryption with automatic key exchange. This is coming soon. Only use for testing and prototyping at the moment.**

An application-level extension on top of Streamr protocol to standardize file sharing in the Streamr ecosystem.

This npm package includes a library and a CLI tool for interacting with resources that follow the StreamrFS specification.

## About

Streamr is a protocol for real-time data sharing. However, its pub/sub messaging, message storage, permissions, and automatic exchange of encryption keys can be leveraged to implement a file sharing system as a higher-level protocol on top of the underlying primitives.

The basics of how StreamrFS works:
 - Streams are used to publish pointers to files stored elsewhere (with potential support for various file transfer protocols as plugins: HTTP, IPFS, Bittorrent, etc.) 
 - For each file, there is a corresponding Streamr stream. 
 - Messages in the stream contain the necessary information for downloading and decrypting the shared file. 
 - The latest message in a stream corresponds to the latest version of a file. Older messages may reference previous versions of the file, allowing for full version histories out-of-the-box.
 - If a file is updated or moved, a new message is published to the corresponding stream.`

## Usage (CLI)

Install with: `npm install -g streamrfs`

## Getting help

Just run `streamrfs`:

```
Usage: streamrfs <command> [<args>]

Command line tool for using StreamrFS, a file sharing extension on top of Streamr https://streamr.network

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  download        Download and decrypt a file from StreamrFS
  encrypt         Encrypt a local file and persist the encryption key
  publish         Publish a file, or update an existing file
  decrypt         Decrypt an already downloaded file
  help [command]  display help for command
```

### Downloading + decrypting files:

`streamrfs download <streamId>`

### Encrypting + publishing files:

```
# Create a file you want to share
echo "This is a file I want to share" > test.txt

# Encrypt the file
streamrfs encrypt test.txt

# Make note of the encryption key output by the encrypt command
# Upload the output file test.txt.enc to some public url
(upload test.txt.enc somewhere)

# Publish the file location to a Streamr stream
streamrfs <streamId> <url> <encryptionKey> 
```

## Usage (as a library)

Install with: `npm install --save streamr-fs`

TODO

## StreamrFS Message Format

StreamrFS file sharing uses messages with a certain JSON format specified here. These messages are published in end-to-end encrypted form to Streamr streams in order to communicate them to valid subscribers. 

A StreamrFS (version 1) message looks like this:

```
{
  "streamrFSVersion": 1,                    // specifies StreamrFS version
  "url": "https://url-to-encrypted-file",   // protocol and locator for the file
  "key": "hex-encoded-AES-key",             // AES key to decrypt the file
}
```
