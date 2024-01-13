<template>
    <div class="xbm-tool-container">
        <div class="viewer-editor-container">
            <xbmViewer ref="xbmViewer" class="icon-container upper-icon" :xbmArray="xbmArray" :gridWidth="gridSize"
                :gridHeight="gridSize" />

            <xbmEditor ref="xbmEditor" class="icon-container" :xbmArray="xbmArray" :gridWidth="gridSize"
                :gridHeight="gridSize" @update-array="updateArray" />

            <div class="size-inputs">
                <v-btn @click="scaleGridDown" icon="mdi-minus"></v-btn>
                <v-text-field placeholder="Size" v-model="gridSize" center-affix></v-text-field>
                <v-btn @click="scaleGridUp" icon="mdi-plus"></v-btn>
            </div>

            <div class="editor-buttons">
                <v-btn @click="shiftLeft" icon="mdi-chevron-left"></v-btn>
                <v-btn @click="shiftRight" icon="mdi-chevron-right"></v-btn>
                <v-btn @click="shiftUp" icon="mdi-chevron-up"></v-btn>
                <v-btn @click="shiftDown" icon="mdi-chevron-down"></v-btn>
            </div>
            <div class="editor-buttons">
                <v-btn @click="rotateLeft" icon="mdi-rotate-left"></v-btn>
                <v-btn @click="rotateRight" icon="mdi-rotate-right"></v-btn>
            </div>

            <xbmConverter ref="xbmConverter" :image="originalImage" :gridWidth="gridSize" :gridHeight="gridSize"
                :imageWidth="imageSize" :imageHeight="imageSize" @xbm-array-converted="onConvertedXbmArray" />
        </div>
        <div class="settings-container">
            <v-file-input ref="fileInput" class="file-input" v-model="originalImage" label="Upload and convert a image"
                @change="handleFileChange" accept=".svg, .png, .jpg, .jpeg" filled clearable></v-file-input>
            <v-btn @click="handleUpload" prepend-icon="mdi-publish"> Upload file </v-btn>
            <div class="size-inputs">
                <v-btn @click="scaleImageDown" icon="mdi-minus"></v-btn>
                <v-text-field placeholder="Size" v-model="imageSize" center-affix></v-text-field>
                <v-btn @click="scaleImageUp" icon="mdi-plus"></v-btn>
            </div>
            <v-btn @click="reset" prepend-icon="mdi-delete"> Reset </v-btn>
            <v-btn @click="invert" prepend-icon="mdi-invert-colors"> Invert </v-btn>
        </div>
    </div>
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
                [],
            originalImage: '',
            gridSize: 24,
            imageSize: 24,
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
        handleUpload() {
            this.$refs.fileInput.click();
        },
        onConvertedXbmArray(array) {
            this.xbmArray = array;
        },
        reset() {
            this.xbmArray = [];
            this.originalImage = '';
            this.$refs.xbmEditor.clearAll();
            this.$refs.fileInput.value = null;
            this.imageSize = 24;
            this.gridSize = 24;
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
        scaleGridUp() {
            this.gridSize = this.gridSize + 1;
        },
        scaleGridDown() {
            this.gridSize = this.gridSize - 1;
        },
        scaleImageUp() {
            this.imageSize = this.imageSize + 1;
            this.$refs.xbmConverter.convertToXbm();
        },
        scaleImageDown() {
            this.imageSize = this.imageSize - 1;
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

.size-inputs {
    display: flex;
    justify-content: center;
}

.editor-buttons {
    display: flex;
}

.editor-buttons>* {
    margin: 0.5rem;
}

.editor-buttons {
    display: flex;
    justify-content: center;
}

.settings-container {
    width: 30%;
    display: flex;
    flex-direction: column;
}

.settings-container>* {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
</style>