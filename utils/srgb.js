const fs = require('fs');
const PNG = require('pngjs').PNG;

function srgbToRGBA(srgb) {
    const r = srgbToLinear(srgb[0]);
    const g = srgbToLinear(srgb[1]);
    const b = srgbToLinear(srgb[2]);
    const a = srgb[3] / 255;
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
        Math.round(a * 255),
    ];
}

function srgbToLinear(value) {
    const v = value / 255;
    if (v <= 0.04045) {
        return v / 12.92;
    } else {
        return Math.pow((v + 0.055) / 1.055, 2.4);
    }
}


function srgbToPNG({ width, height, srgb, filePath }) {
    const data = new Uint8Array(width * height * 4);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const rgba = srgbToRGBA(srgb.slice(index, index + 4));
            data[index] = rgba[0];
            data[index + 1] = rgba[1];
            data[index + 2] = rgba[2];
            data[index + 3] = rgba[3];
        }
    }

    const png = new PNG({ width, height });
    png.data = data;

    png.pack().pipe(fs.createWriteStream(filePath));
}

module.exports = srgbToPNG