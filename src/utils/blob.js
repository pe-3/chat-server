

function blobToUint8Array(blob) {
    console.log(blob instanceof Blob);
    return new Promise((resolve, reject) => {
        const chunks = [];

        blob.on('data', (chunk) => {
            chunks.push(chunk);
        });

        blob.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const array = new Uint8Array(buffer);
            resolve(array);
        });

        blob.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = blobToUint8Array;