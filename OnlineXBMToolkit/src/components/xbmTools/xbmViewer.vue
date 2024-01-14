<template>
    <div class="icon-container">
        <div v-for="(row, rowIndex) in pixels" :key="rowIndex" class="pixel-row">
            <div v-for="(pixel, colIndex) in row" :key="colIndex" class="pixel"
                :style="{ backgroundColor: pixel ? 'white' : 'transparent' }">
            </div>
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
                console.log("test");
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
        };
    },
    mounted() {
        this.decode();
    },
    methods: {
        decode() {
            const rows = this.gridWidth;
            const cols = this.gridHeight;
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
            console.log("done decoding...");
        },
        handleXbmArrayChange() {
            this.decode();
        }
    },
};
</script>
  
<style scoped>
.icon-container {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
}

.pixel-row {
    display: flex;
}

.pixel {
    flex: 1;
    aspect-ratio: 1;
    cursor: pointer;
}
</style>
  