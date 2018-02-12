## Storj Idea

use the https://github.com/Storj/storj.js library for browser access to storage.
use the https://github.com/storj/node-libstorj library for access inside a lambda function

To upload:
1. `web3.sha3` on the image file data to get a 256 bit encoding of it
2. Call the serverless function with the hash
3. Serverless creates a bucket with that hash, makes it publically readable, then issues a single use writeable token to create a file called image.blah. It returns that token to the client browser
4. Client browser uses that token to upload to Storj.
5. Proceed with ethereum contract invocation, saving the sha3 into the block

To download:
1. Get the image's sha3 from the chain
2. download the file into the browser's local storage and populate all our images with that.