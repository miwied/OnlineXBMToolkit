<template>
    <div v-for="(row, rowIndex) in pixels" :key="rowIndex" class="pixel-row">
        <div v-for="(pixel, colIndex) in row" :key="colIndex" class="pixel"
            :style="{ backgroundColor: pixel ? 'white' : 'black' }" @click="togglePixel(rowIndex, colIndex)"
            @mousedown="startPainting(rowIndex, colIndex)" @mouseup="stopPainting"
            @mousemove="paintPixel(rowIndex, colIndex)">
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        xbmArray: {
            type: Array,
            required: true,
        },
        gridWidth: {
            type: Number,
            required: true,
        },
        gridHeight: {
            type: Number,
            required: true,
        },
    },
    watch: {
        xbmArray: function (newVal, oldVal) {
            if (JSON.stringify(this.xbmArray) !== JSON.stringify(this.newVal)) {
                this.handleXbmArrayChange();
            }
        },
        gridWidth: function (newVal, oldVal) {
            this.decode();
        },
        gridHeight: function (newVal, oldVal) {
            this.decode();
        },
    },
    data() {
        return {
            pixels: [],
            isPainting: false,
            initialColor: 1,
        };
    },
    mounted() {
        this.decode();
    },
    methods: {
        decode() {
            const rows = this.gridHeight;
            const cols = this.gridWidth;
            const totalPixels = rows * cols;
            const pixels = [];

            for (let i = 0; i < totalPixels; i++) {
                const rowIndex = Math.floor(i / cols);
                const colIndex = i % cols;
                const byteIndex = Math.floor((rowIndex * Math.ceil(cols / 8)) + colIndex / 8);
                const bitIndex = colIndex % 8;

                if (!pixels[rowIndex]) pixels[rowIndex] = [];
                pixels[rowIndex][colIndex] = (this.xbmArray[byteIndex] & (1 << bitIndex)) ? 1 : 0;
            }

            this.pixels = pixels;
        },
        encodeAsStringArray(encodedArray) {
            const hexStringArray = encodedArray.map(value => '0x' + value.toString(16).padStart(2, '0'));
            return hexStringArray;
        },
        encode() {
            const rows = this.gridWidth;
            const cols = this.gridHeight;
            const totalPixels = rows * cols;
            const encodedArray = [];

            for (let i = 0; i < totalPixels; i++) {
                const rowIndex = Math.floor(i / cols);
                const colIndex = i % cols;
                const byteIndex = Math.floor((rowIndex * Math.ceil(cols / 8)) + colIndex / 8);
                const bitIndex = colIndex % 8;

                if (!encodedArray[byteIndex]) encodedArray[byteIndex] = 0;
                encodedArray[byteIndex] |= this.pixels[rowIndex][colIndex] << bitIndex;
            }

            this.$emit("update-array", encodedArray);
            console.log(this.encodeAsStringArray(encodedArray).toString());
            return encodedArray;
        },
        togglePixel(rowIndex, colIndex) {
            if (!this.isPainting) {
                this.pixels[rowIndex][colIndex] = !this.pixels[rowIndex][colIndex];
            }
            this.encode();
        },
        startPainting(rowIndex, colIndex) {
            this.isPainting = true;
            this.initialColor = this.pixels[rowIndex][colIndex];
            this.paintPixel(rowIndex, colIndex);
        },
        stopPainting() {
            this.isPainting = false;
            this.encode();
        },
        paintPixel(rowIndex, colIndex) {
            if (this.isPainting) {
                this.pixels[rowIndex][colIndex] = this.initialColor;
            }
        },
        handleXbmArrayChange() {
            this.decode();
        },
        clearAll() {
            this.pixels = this.pixels.map(row => row.map(() => 0));
            this.encode();
        },
        shiftLeft() {
            this.pixels.forEach(row => row.push(row.shift()));
            this.encode();
        },
        shiftRight() {
            this.pixels.forEach(row => row.unshift(row.pop()));
            this.encode();
        },
        shiftUp() {
            this.pixels.push(this.pixels.shift());
            this.encode();
        },
        shiftDown() {
            this.pixels.unshift(this.pixels.pop());
            this.encode();
        },
        rotateLeft() {
            this.pixels = this.pixels[0].map((_, colIndex) => this.pixels.map(row => row[colIndex]));
            this.pixels.reverse();
            this.encode();
        },
        rotateRight() {
            this.pixels = this.pixels[0].map((_, colIndex) => this.pixels.map(row => row[colIndex]));
            this.pixels.forEach(row => row.reverse());
            this.encode();
        },
        invert() {
            this.pixels = this.pixels.map(row => row.map(pixel => (pixel === 0 ? 1 : 0)));
            this.encode();
        },
    },
};
</script>
  
<style scoped>
.pixel-row {
    display: flex;
}

.pixel {
    width: 1vh;
    aspect-ratio: 1;
    border: 1px solid #ccc;
    cursor: pointer;
}
</style>
  