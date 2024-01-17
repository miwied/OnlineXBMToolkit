<template>
    <div class="xbm-tool-container">
        <div class="input-output-container">
            <v-card class="card-container" variant="tonal">
                <div class="text-icon-container">
                    <v-icon> {{ 'mdi-publish' }} </v-icon>
                    <p class="text-h6">Input</p>
                </div>
                <v-file-input ref="fileInput" style="display: none;" @change="handleFileChange"
                    accept=".svg, .png, .jpg, .jpeg"></v-file-input>
                <v-btn @click="handleUpload" prepend-icon="mdi-publish"> Upload image file </v-btn>
                <v-btn @click="reset" prepend-icon="mdi-delete"> Reset </v-btn>

                <div class="size-inputs">
                    <div class="size-input">
                        <v-text-field label="Image-height" v-model="imageHeight" suffix="px" hide-details></v-text-field>
                        <div class="size-buttons">
                            <v-btn @click="decreaseSize('imageHeight', 'imageWidth', imageSizeIsEqual)"
                                style="font-size: 25px;">−</v-btn>
                            <v-btn @click="increaseSize('imageHeight', 'imageWidth', imageSizeIsEqual)"
                                style="font-size: 25px;">+</v-btn>
                        </div>
                    </div>
                    <v-btn @click="imageSizeIsEqual = !imageSizeIsEqual">
                        <v-icon>{{ toggleImageSizeIcon }}</v-icon>
                    </v-btn>
                    <div class="size-input">
                        <v-text-field label="Image-witdh" v-model="imageWidth" suffix="px" hide-details></v-text-field>
                        <div class="size-buttons">
                            <v-btn @click="decreaseSize('imageWidth', 'imageHeight', imageSizeIsEqual)"
                                style="font-size: 25px;">−</v-btn>
                            <v-btn @click="increaseSize('imageWidth', 'imageHeight', imageSizeIsEqual)"
                                style="font-size: 25px;">+</v-btn>
                        </div>
                    </div>
                </div>
                <div class="size-inputs">
                    <div class="size-input">
                        <v-text-field label="Grid-height" v-model="gridHeight" suffix="px" hide-details></v-text-field>
                        <div class="size-buttons">
                            <v-btn @click="decreaseSize('gridHeight', 'gridWidth', gridSizeIsEqual)"
                                style="font-size: 25px;">−</v-btn>
                            <v-btn @click="increaseSize('gridHeight', 'gridWidth', gridSizeIsEqual)"
                                style="font-size: 25px;">+</v-btn>
                        </div>
                    </div>
                    <v-btn @click="gridSizeIsEqual = !gridSizeIsEqual">
                        <v-icon>{{ toggleGridSizeIcon }}</v-icon>
                    </v-btn>
                    <div class="size-input">
                        <v-text-field label="Grid-witdh" v-model="gridWidth" suffix="px" hide-details></v-text-field>
                        <div class="size-buttons">
                            <v-btn @click="decreaseSize('gridWidth', 'gridHeight', gridSizeIsEqual)"
                                style="font-size: 25px;">−</v-btn>
                            <v-btn @click="increaseSize('gridWidth', 'gridHeight', gridSizeIsEqual)"
                                style="font-size: 25px;">+</v-btn>
                        </div>
                    </div>
                </div>
            </v-card>

            <v-card class="card-container" variant="tonal">
                <div class="text-icon-container">
                    <v-icon> {{ 'mdi-download' }} </v-icon>
                    <p class="text-h6">Output</p>
                </div>
                <v-btn @click="handleDownload" prepend-icon="mdi-download"> Download xbm file </v-btn>
                <v-btn @click="copyText" prepend-icon="mdi-content-copy"> Copy array </v-btn>
                <v-textarea class="pa-0" label="Formatted array:" v-model="outputArray"></v-textarea>
            </v-card>
        </div>
    </div>

    <v-card class="card-container" variant="tonal">
        <div class="text-icon-container">
            <v-icon> {{ 'mdi-pencil' }} </v-icon>
            <p class="text-h6">Edit</p>
        </div>
        <xbmEditor ref="xbmEditor" class="xbm-tool" :xbmArray="xbmArray" :gridWidth="gridWidth" :gridHeight="gridHeight"
            @update-array="updateArray" />
        <div class="editor-buttons">
            <v-btn @click="rotateLeft" icon="mdi-rotate-left"></v-btn>
            <v-btn @click="shiftLeft" icon="mdi-chevron-left"></v-btn>
            <v-btn @click="shiftRight" icon="mdi-chevron-right"></v-btn>
            <v-btn @click="shiftUp" icon="mdi-chevron-up"></v-btn>
            <v-btn @click="shiftDown" icon="mdi-chevron-down"></v-btn>
            <v-btn @click="rotateRight" icon="mdi-rotate-right"></v-btn>
        </div>
        <div class="editor-buttons">
            <v-btn @click="invert" prepend-icon="mdi-invert-colors"> Invert </v-btn>
        </div>
    </v-card>

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
            xbmArray: [],
            originalImage: '',
            gridHeight: 24,
            gridWidth: 24,
            imageHeight: 24,
            imageWidth: 24,
            gridSizeIsEqual: true,
            imageSizeIsEqual: true,
        };
    },
    computed: {
        toggleGridSizeIcon() {
            return this.gridSizeIsEqual ? 'mdi-link' : 'mdi-link-off';
        },
        toggleImageSizeIcon() {
            return this.imageSizeIsEqual ? 'mdi-link' : 'mdi-link-off';
        }
    },
    watch: {
        gridSizeIsEqual: function (newVal, oldVal) {
            if (this.gridSizeIsEqual && this.gridHeight !== this.gridWidth) {
                this.gridHeight = this.gridWidth;
            }
        },
        imageSizeIsEqual: function (newVal, oldVal) {
            if (this.imageSizeIsEqual && this.imageHeight !== this.imageWidth) {
                this.imageHeight = this.imageWidth;
            }
        },
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
        handleDownload() {
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
            this.gridHeight = 24;
            this.gridWidth = 24;
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
        increaseSize(mainSizeProperty, optionalSizeProperty, equalSizeState) {
            if (this[mainSizeProperty] !== undefined) {
                this[mainSizeProperty]++;
            }
            if (equalSizeState && this[optionalSizeProperty] !== undefined) {
                this[optionalSizeProperty] = this[mainSizeProperty];
            }
            if (this.originalImage !== null && this.originalImage !== undefined) {
                this.$refs.xbmConverter.convertToXbm();
            }
        },
        decreaseSize(mainSizeProperty, optionalSizeProperty, equalSizeState) {
            if (this[mainSizeProperty] !== undefined) {
                this[mainSizeProperty]--;
            }
            if (equalSizeState && this[optionalSizeProperty] !== undefined) {
                this[optionalSizeProperty] = this[mainSizeProperty];
            }
            if (this.originalImage !== null && this.originalImage !== undefined) {
                this.$refs.xbmConverter.convertToXbm();
            }
        }
    }
}
</script>
  
<style scoped>
.xbm-tool-container {
    display: flex;
    flex-wrap: wrap;
}

.text-icon-container {
    display: flex;
    align-items: center;
    color: rgb(107, 107, 107);
    justify-content: center;
}

.text-icon-container>* {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
}

.input-output-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}

.size-inputs {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.size-inputs>* {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
}

.size-input {
    width: 100%;
}

.size-buttons {
    display: flex;
    width: 50%;
}

.size-buttons>* {
    width: 100%;
    background-color: rgb(54, 54, 54);
    border: 1px solid rgb(27, 27, 27);
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

.card-container {
    display: flex;
    flex: 1;
    margin: 0.5rem;
    padding: 0.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    align-items: center;
    min-width: 300px;
    flex-direction: column;
}

.card-container>* {
    margin: 0.5rem;
    width: 100%;
}
</style>