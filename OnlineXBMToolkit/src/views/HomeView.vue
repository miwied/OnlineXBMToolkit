<template>
    <div class="xbm-tool-container">

        <v-file-input class="file-input" label="Upload and convert a image" ref="fileInput" @change="handleFileChange"
            @clear="test" accept=".svg, .png, .jpg, .jpeg" filled></v-file-input>
        <v-btn @click="reset" class="input"> Reset </v-btn>
        <!-- <v-btn @click="reset" class="input"> Invert </v-btn> -->

        <xbmViewer ref="xbmViewer" class="icon-container upper-icon" :xbmArray="xbmArray" :gridWidth="gridWidth"
            :gridHeight="gridHeight" />
        <xbmEditor ref="xbmEditor" class="icon-container" :xbmArray="xbmArray" :gridWidth="gridWidth"
            :gridHeight="gridHeight" @update-array="updateArray" />

        <!-- <button @click="reset" class="input">reset</button>
        <button @click="invert" class="input">invert</button>
        <button @click="shiftLeft" class="input">shift left</button>
        <button @click="shiftRight" class="input">shift right</button>
        <button @click="shiftUp" class="input">shift up</button>
        <button @click="shiftDown" class="input">shift down</button>
        <button @click="rotateLeft" class="input">rotate left</button>
        <button @click="rotateRight" class="input">rotate right</button>
        <button @click="scaleUp" class="input">scale up</button>
        <button @click="scaleDown" class="input">scale down</button>
        <label class="input" for="imgWidth">Image Width</label>
        <input class="input" type="number" id="imgWidth" v-model="imageWidth">
        <label class="input" for="imgHeight">Image Height</label>
        <input class="input" type="number" id="imgHeight" v-model="imageHeight"> -->
    </div>

    <xbmConverter ref="xbmConverter" :image="originalImage" :gridWidth="gridWidth" :gridHeight="gridHeight"
        :imageWidth="imageWidth" :imageHeight="imageHeight" @xbm-array-converted="onConvertedXbmArray" />
</template>
  
<script>
import xbmViewer from '@/components/xbmTools/xbmViewer.vue'
import xbmEditor from '@/components/xbmTools/xbmEditor.vue'
import xbmConverter from '@/components/xbmTools/xbmConverter.vue'

export default {
    components: {
        xbmViewer,
        xbmEditor,
        xbmConverter
    },
    data() {
        return {
            xbmArray:
                [
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
                ],
            originalImage: '',
            gridWidth: 30,
            gridHeight: 30,
            imageWidth: 24,
            imageHeight: 24,
        };
    },
    methods: {
        updateArray(array) {
            this.xbmArray = array;
        },
        handleFileChange(event) {
            const file = event.target.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.originalImage = e.target.result;
                    const img = new Image();
                    img.onload = () => {
                        this.$refs.xbmConverter.convertToXbm();
                    };
                    img.src = this.originalImage;
                };

                reader.readAsDataURL(file);
            }
        },
        onConvertedXbmArray(array) {
            this.xbmArray = array;
        },
        reset() {
            this.xbmArray = [];
            this.originalImage = '';
            this.$refs.xbmEditor.clearAll();
            this.$refs.fileInput.value = null;
            this.imageHeight = 24;
            this.imageWidth = 24;
        },
        invert() {
            this.$refs.xbmEditor.invert();
        },
        shiftLeft() {
            this.$refs.xbmEditor.shiftLeft();
        },
        shiftRight() {
            this.$refs.xbmEditor.shiftRight();
        },
        shiftUp() {
            this.$refs.xbmEditor.shiftUp();
        },
        shiftDown() {
            this.$refs.xbmEditor.shiftDown();
        },
        rotateLeft() {
            this.$refs.xbmEditor.rotateLeft()();
        },
        rotateRight() {
            this.$refs.xbmEditor.rotateRight()();
        },
        scaleUp() {
            this.imageWidth = this.imageWidth + 1;
            this.imageHeight = this.imageHeight + 1;
            this.$refs.xbmConverter.convertToXbm();
        },
        scaleDown() {
            this.imageWidth = this.imageWidth - 1;
            this.imageHeight = this.imageHeight - 1;
            this.$refs.xbmConverter.convertToXbm();
        },
    }
}
</script>
  
<style scoped>
.xbm-tool-container {
    display: flex;
    align-items: start;
    flex-direction: row;
}

.file-input {
    width: 30%;
    margin: 0;
    padding: 0;
}

.upper-icon {
    margin-bottom: 20px;
}

.icon-container {
    width: 23%;
}
</style>