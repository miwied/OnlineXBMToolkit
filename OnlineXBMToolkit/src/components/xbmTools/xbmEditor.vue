<template>
    <div v-for="(row, rowIndex) in pixels" :key="rowIndex" class="pixel-row">
        <div v-for="(pixel, colIndex) in row" :key="colIndex" class="pixel"
            :style="{ backgroundColor: pixel ? 'white' : 'black' }" @click="toggleSinglePixel(rowIndex, colIndex)"
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
    emits: ['update-array'],
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
            undoStack: [],
            redoStack: [],
            initialColor: 1,
            isPainting: false,
            paintedPixelsCount: 0,
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
        encode(saveHistory = true) {
            if (saveHistory) {
                this.undoStack.push(JSON.parse(JSON.stringify(this.pixels)));
                this.redoStack = [];
            }

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
            return encodedArray;
        },
        undo() {
            if (this.undoStack.length > 0) {
                const previousState = this.undoStack.pop();
                this.redoStack.push(JSON.parse(JSON.stringify(this.pixels)));
                this.pixels = previousState;
                this.encode(false);
            }
        },
        redo() {
            if (this.redoStack.length > 0) {
                const nextState = this.redoStack.pop();
                this.undoStack.push(JSON.parse(JSON.stringify(this.pixels)));
                this.pixels = nextState;
                this.encode(false);
            }
        },
        toggleSinglePixel(rowIndex, colIndex) {
            if (!this.isPainting) {
                this.pixels[rowIndex][colIndex] = !this.pixels[rowIndex][colIndex];
                this.encode();
            }
        },
        startPainting(rowIndex, colIndex) {
            this.isPainting = true;
            this.initialColor = this.pixels[rowIndex][colIndex];
            this.paintedPixelsCount = 0;
            this.paintPixel(rowIndex, colIndex);
        },
        stopPainting() {
            if (this.isPainting && this.paintedPixelsCount > 1) {
                this.encode();
            }
            this.paintedPixelsCount = 0;
            this.isPainting = false;
        },
        paintPixel(rowIndex, colIndex) {
            if (this.isPainting) {
                this.pixels[rowIndex][colIndex] = this.initialColor;
                this.paintedPixelsCount++;
            }
        },
        handleXbmArrayChange() {
            this.decode();
        },
        clearAll() {
            this.pixels = this.pixels.map(row => row.map(() => 0));
            this.undoStack = [];
            this.redoStack = [];
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
    cursor: pointer;
    border: 1px solid #ccc;
}
</style>
  