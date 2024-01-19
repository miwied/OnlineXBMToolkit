<template></template>
  
<script>
export default {
    props: {
        image: {
            type: String,
            required: true,
        },
        gridWidth: {
            type: Number,
            required: false,
        },
        gridHeight: {
            type: Number,
            required: false,
        },
        imageWidth: {
            type: Number,
            required: false,
        },
        imageHeight: {
            type: Number,
            required: false,
        },
    },
    methods: {
        getResizedXbmArray(xbmArray) {
            const gridWidth = this.gridWidth;
            const gridHeight = this.gridHeight;
            const imageWidth = this.imageWidth;
            const imageHeight = this.imageHeight;

            const startRow = Math.floor((gridHeight - imageHeight) / 2);
            const startCol = Math.floor((gridWidth - imageWidth) / 2);

            const totalPixels = gridWidth * gridHeight;
            const pixels = [];

            for (let i = 0; i < totalPixels; i++) {
                const rowIndex = Math.floor(i / gridWidth);
                const colIndex = i % gridWidth;
                if (
                    rowIndex >= startRow &&
                    rowIndex < startRow + imageHeight &&
                    colIndex >= startCol &&
                    colIndex < startCol + imageWidth
                ) {
                    const imageRow = rowIndex - startRow;
                    const imageCol = colIndex - startCol;

                    const byteIndex = Math.floor((imageRow * Math.ceil(imageWidth / 8)) + imageCol / 8);
                    const bitIndex = imageCol % 8;

                    if (!pixels[rowIndex]) pixels[rowIndex] = [];

                    pixels[rowIndex][colIndex] = (xbmArray[byteIndex] & (1 << bitIndex)) ? 1 : 0;

                } else {
                    if (!pixels[rowIndex]) pixels[rowIndex] = [];
                    pixels[rowIndex][colIndex] = 0;
                }
            }

            const resizedXbmArray = [];
            for (let row = 0; row < gridHeight; row++) {
                for (let col = 0; col < gridWidth; col += 8) {
                    const byte = pixels[row] ? pixels[row].slice(col, col + 8) : [];
                    const byteValue = byte.reduce((acc, bit, index) => acc + (bit << index), 0);
                    resizedXbmArray.push(byteValue);
                }
            }

            return resizedXbmArray;
        },
        convertToXbm() {
            const img = new Image();
            img.onload = () => {
                const rows = this.imageWidth;
                const cols = this.imageHeight;
                const imageData = this.getImageData(img, rows, cols);
                let xbmArray = this.encode(imageData, rows, cols);
                xbmArray = this.getResizedXbmArray(xbmArray);
                this.$emit('xbm-array-converted', xbmArray);
            };

            img.src = this.image;
        },
        getImageData(img, width, height) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            return ctx.getImageData(0, 0, width, height).data;
        },
        encode(imageData, rows, cols) {
            const totalPixels = rows * cols;
            const encodedArray = [];

            for (let i = 0; i < totalPixels; i++) {
                const rowIndex = Math.floor(i / cols);
                const colIndex = i % cols;
                const byteIndex = Math.floor((rowIndex * Math.ceil(cols / 8)) + colIndex / 8);
                const bitIndex = colIndex % 8;

                if (!encodedArray[byteIndex]) encodedArray[byteIndex] = 0;
                const alpha = imageData[i * 4 + 3];
                const bit = alpha === 0 ? 0 : 1;
                encodedArray[byteIndex] |= bit << bitIndex;
            }

            return encodedArray;
        },
        convertXbmArrayToXbmString(encodedArray, imageName, cFormat = true) {
            let xbmContent = '';

            const regex = /\.\w+$/;
            let adjustedImageName = (str => str ? str : 'image')(imageName);
            // remove file extensions
            adjustedImageName = adjustedImageName.replace(regex, '');

            if (cFormat) {
                xbmContent += `#define ${adjustedImageName}_width ${this.gridWidth}\n#define ${adjustedImageName}_height ${this.gridHeight}\nstatic unsigned char ${adjustedImageName}_bits[] = {\n`;
            }
            xbmContent += encodedArray.map(value => '0x' + value.toString(16).padStart(2, '0')).toString();
            xbmContent += '\n};';
            return xbmContent;
        }
    },
};
</script>
  
<style scoped></style>