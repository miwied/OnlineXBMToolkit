<template>
    <div v-for="(row, rowIndex) in pixels" :key="rowIndex" class="pixel-row">
        <div v-for="(pixel, colIndex) in row" :key="colIndex" class="pixel"
            :style="{ backgroundColor: pixel ? 'white' : 'transparent' }">
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
        handleXbmArrayChange() {
            this.decode();
        }
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
}
</style>
  