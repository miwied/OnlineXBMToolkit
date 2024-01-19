<template>
    <div class="xbm-tool-container">
        <div class="input-output-container">
            <v-card class="card-container" variant="tonal">
                <div class="text-icon-container">
                    <v-icon> {{ 'mdi-publish' }} </v-icon>
                    <p class="text-h6">&nbsp;Input</p>
                </div>
                <div class="image-details-container" v-if="imageName !== null">
                    <p>{{ imageName }}</p>
                    <v-btn @click="clear" icon="mdi-close" variant="plain"></v-btn>
                </div>
                <v-file-input ref="fileInput" style="display: none;" @change="handleFileChange"
                    accept=".svg, .png, .jpg, .jpeg"></v-file-input>
                <v-btn @click="handleUpload" prepend-icon="mdi-publish"> Upload image file </v-btn>
                <v-btn @click="reset" prepend-icon="mdi-restart"> Reset all </v-btn>

                <div class="size-inputs">
                    <div class="size-input">
                        <v-text-field label="Image-height" v-model="imageHeight" suffix="px" hide-details></v-text-field>
                        <div class="size-buttons">
                            <v-btn @click="decreaseSize('imageHeight')" style="font-size: 25px;">−</v-btn>
                            <v-btn @click="increaseSize('imageHeight')" style="font-size: 25px;">+</v-btn>
                        </div>
                    </div>
                    <div>
                        <v-btn @click="imageSizeIsEqual = !imageSizeIsEqual">
                            <v-icon>{{ toggleImageSizeIcon }}</v-icon>
                        </v-btn>
                        <v-btn @click="resetImageSize" class="mt-1">
                            <v-icon>{{ "mdi-restart" }}</v-icon>
                        </v-btn>
                    </div>
                    <div class="size-input">
                        <v-text-field label="Image-witdh" v-model="imageWidth" suffix="px" hide-details></v-text-field>
                        <div class="size-buttons">
                            <v-btn @click="decreaseSize('imageWidth')" style="font-size: 25px;">−</v-btn>
                            <v-btn @click="increaseSize('imageWidth')" style="font-size: 25px;">+</v-btn>
                        </div>
                    </div>
                </div>
                <div class="size-inputs">
                    <div class="size-input">
                        <v-text-field label="Grid-height" v-model="gridHeight" suffix="px" hide-details></v-text-field>
                        <div class="size-buttons">
                            <v-btn @click="decreaseSize('gridHeight')" style="font-size: 25px;">−</v-btn>
                            <v-btn @click="increaseSize('gridHeight')" style="font-size: 25px;">+</v-btn>
                        </div>
                    </div>
                    <div>
                        <v-btn @click="gridSizeIsEqual = !gridSizeIsEqual">
                            <v-icon>{{ toggleGridSizeIcon }}</v-icon>
                        </v-btn>
                        <v-btn @click="resetGridSize" class="mt-1">
                            <v-icon>{{ "mdi-restart" }}</v-icon>
                        </v-btn>
                    </div>
                    <div class="size-input">
                        <v-text-field label="Grid-witdh" v-model="gridWidth" suffix="px" hide-details></v-text-field>
                        <div class="size-buttons">
                            <v-btn @click="decreaseSize('gridWidth')" style="font-size: 25px;">−</v-btn>
                            <v-btn @click="increaseSize('gridWidth')" style="font-size: 25px;">+</v-btn>
                        </div>
                    </div>
                </div>
            </v-card>

            <v-card class="card-container" variant="tonal">
                <div class="text-icon-container">
                    <v-icon> {{ 'mdi-download' }} </v-icon>
                    <p class="text-h6">&nbsp;Output</p>
                </div>
                <v-btn @click="handleDownload" prepend-icon="mdi-download"> Download xbm file </v-btn>
                <v-btn @click="copyText" prepend-icon="mdi-content-copy"> Copy array </v-btn>
                <v-textarea class="pa-0" label="Formatted array:" v-model="outputArray"></v-textarea>
            </v-card>
        </div>
    </div>

    <v-card class="card-container" variant="tonal">
        <v-btn class="text-icon-container" @click="isEditMode = !isEditMode">
            <v-icon> {{ toggleEditModeIcon }} </v-icon>
            <p class="text-h6">&nbsp; {{ toggleEditModeText }}</p>
        </v-btn>
        <div class="card-container" v-if="isEditMode">
            <xbmEditor ref="xbmEditor" :xbmArray="xbmArray" :gridWidth="gridWidth" :gridHeight="gridHeight"
                @update-array="updateArray" />
            <div class="editor-buttons">
                <v-btn @click="shiftLeft" icon="mdi-chevron-left"></v-btn>
                <v-btn @click="shiftRight" icon="mdi-chevron-right"></v-btn>
                <v-btn @click="shiftUp" icon="mdi-chevron-up"></v-btn>
                <v-btn @click="shiftDown" icon="mdi-chevron-down"></v-btn>
                <v-btn @click="rotateLeft" icon="mdi-rotate-left"></v-btn>
                <v-btn @click="rotateRight" icon="mdi-rotate-right"></v-btn>
            </div>
            <div class="editor-buttons">
                <v-btn @click="undo" prepend-icon="mdi-undo"> Undo </v-btn>
                <v-btn @click="redo" prepend-icon="mdi-redo"> Redo </v-btn>
                <v-btn @click="invert" prepend-icon="mdi-invert-colors"> Invert </v-btn>
                <v-btn @click="clear" prepend-icon="mdi-delete"> Clear </v-btn>
            </div>
        </div>
        <div class="card-container" v-else>
            <xbmViewer ref="xbmViewer" :xbmArray="xbmArray" :gridWidth="gridWidth" :gridHeight="gridHeight" />
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
            originalImage: null,
            imageName: null,
            gridHeight: 24,
            gridWidth: 24,
            imageHeight: 24,
            imageWidth: 24,
            gridSizeIsEqual: true,
            imageSizeIsEqual: true,
            isEditMode: true,
        };
    },
    computed: {
        toggleGridSizeIcon() {
            return this.gridSizeIsEqual ? 'mdi-link' : 'mdi-link-off';
        },
        toggleImageSizeIcon() {
            return this.imageSizeIsEqual ? 'mdi-link' : 'mdi-link-off';
        },
        toggleEditModeIcon() {
            return this.isEditMode ? 'mdi-eye' : 'mdi-pencil';
        },
        toggleEditModeText() {
            return this.isEditMode ? 'Preview' : 'Edit';
        },
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
        gridHeight: function (newVal, oldVal) {
            if (this.gridSizeIsEqual && this.gridWidth !== this.gridHeight) {
                this.gridWidth = this.gridHeight;
            }
            this.convertToXbm();
        },
        gridWidth: function (newVal, oldVal) {
            if (this.gridSizeIsEqual && this.gridWidth !== this.gridHeight) {
                this.gridHeight = this.gridWidth;
            }
            this.convertToXbm();
        },
        imageHeight: function (newVal, oldVal) {
            if (this.imageSizeIsEqual && this.imageWidth !== this.imageHeight) {
                this.imageWidth = this.imageHeight;
            }
            this.convertToXbm();
        },
        imageWidth: function (newVal, oldVal) {
            if (this.imageSizeIsEqual && this.imageWidth !== this.imageHeight) {
                this.imageHeight = this.imageWidth;
            }
            this.convertToXbm();
        },
    },
    methods: {
        updateArray(array) {
            console.log("updating array");
            this.xbmArray = array;
        },
        handleFileChange(event) {
            const file = event.target.files[0];

            if (file) {
                this.imageName = file.name;
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
            // const xbmContent = this.convertArrayToXBM(this.xbmArray);
            // const blob = new Blob([xbmContent], { type: 'text/plain' });
            // const url = window.URL.createObjectURL(blob);
            // const link = document.createElement('a');
            // link.href = url;
            // link.download = `${this.imageName}.xbm`;
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // window.URL.revokeObjectURL(url);
        },
        onConvertedXbmArray(array) {
            this.xbmArray = array;
        },
        reset() {
            this.resetImageData();
            this.xbmArray = [];
            this.isEditMode = true;
            this.resetImageSize();
            this.resetGridSize();
            this.$refs.xbmEditor.clearAll();
        },
        undo() {
            this.$refs.xbmEditor.undo();
        },
        redo() {
            this.$refs.xbmEditor.redo();
        },
        invert() {
            this.$refs.xbmEditor.invert();
        },
        clear() {
            this.resetImageData();
            this.$refs.xbmEditor.clearAll();
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
            this.$refs.xbmEditor.rotateLeft();
        },
        rotateRight() {
            this.$refs.xbmEditor.rotateRight();
        },
        increaseSize(mainSizeProperty) {
            if (this[mainSizeProperty] !== undefined) {
                this[mainSizeProperty]++;
            }
        },
        decreaseSize(mainSizeProperty) {
            if (this[mainSizeProperty] !== undefined) {
                this[mainSizeProperty]--;
            }
        },
        convertToXbm() {
            if (this.originalImage !== null && this.originalImage !== undefined) {
                this.$refs.xbmConverter.convertToXbm();
            }
        },
        resetImageData() {
            this.imageName = null;
            this.originalImage = null;
            this.$refs.fileInput.value = null;
        },
        resetImageSize() {
            this.imageSizeIsEqual = true;
            this.imageHeight = 24;
        },
        resetGridSize() {
            this.gridSizeIsEqual = true;
            this.gridHeight = 24;
        },
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
    max-width: 15%;
}

.image-details-container {
    display: flex;
    align-items: center;
    color: rgb(107, 107, 107);
    justify-content: center;
}

@media only screen and (max-width: 600px) {
    .text-icon-container {
        max-width: 35%;
    }
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
    flex-wrap: wrap;
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
    flex-direction: column;
    align-items: center;
    flex: 1;
    margin: 0.5rem;
    padding: 0.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    min-width: 300px;
}

.card-container>* {
    margin: 0.5rem;
    width: 100%;
}
</style>