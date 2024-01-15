<template>
    <div class="xbm-tool-container">
        <div class="input-output-container">
            <v-card prepend-icon="mdi-publish" title="Input" class="card-container" variant="tonal">
                <v-file-input ref="fileInput" style="display: none;" @change="handleFileChange"
                    accept=".svg, .png, .jpg, .jpeg"></v-file-input>
                <v-btn @click="handleUpload" prepend-icon="mdi-publish"> Upload image file </v-btn>
                <v-btn @click="reset" prepend-icon="mdi-delete"> Reset </v-btn>

                <div class="size-inputs">
                    <v-text-field label="Grid-height" placeholder="Size" v-model="gridHeight"></v-text-field>
                    <v-btn @click="scaleGridDown" icon="mdi-minus"></v-btn>
                    <v-btn @click="scaleGridUp" icon="mdi-plus"></v-btn>
                    <v-btn-toggle>
                        <v-btn @click="x" icon="mdi-link-off"></v-btn>
                    </v-btn-toggle>
                    <v-text-field label="Grid-width" placeholder="Size" v-model="gridWidth"></v-text-field>
                    <v-btn @click="scaleGridDown" icon="mdi-minus"></v-btn>
                    <v-btn @click="scaleGridUp" icon="mdi-plus"></v-btn>
                </div>
                <div class="size-inputs">
                    <v-btn @click="scaleImageDown" icon="mdi-minus"></v-btn>
                    <v-text-field label="Image-height" placeholder="Size" v-model="imageHeight"></v-text-field>
                    <v-btn-toggle>
                        <v-btn @click="x" icon="mdi-link-off"></v-btn>
                    </v-btn-toggle>
                    <v-text-field label="Image-width" placeholder="Size" v-model="imageWidth"></v-text-field>
                    <v-btn @click="scaleImageUp" icon="mdi-plus"></v-btn>
                </div>
            </v-card>

            <v-divider :thickness="6" vertical></v-divider>

            <v-card prepend-icon="mdi-download" title="Output" class="card-container" variant="tonal">
                <v-btn @click="handleDownload" prepend-icon="mdi-download"> Download xbm file </v-btn>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="9">
                            <v-text-field v-model="text" label="Copy this text" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="3">
                            <v-btn @click="copyText">
                                Copy
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </div>
    </div>
    <v-divider :thickness="6"></v-divider>

    <v-card prepend-icon="mdi-pencil" title="Edit" class="card-container edit-card" variant="tonal">
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
        scaleGridUp() {
            this.gridWidth++;
            this.gridHeight++;
            if (this.originalImage != null && this.originalImage != undefined) {
                this.$refs.xbmConverter.convertToXbm();
            }
        },
        scaleGridDown() {
            this.gridWidth--;
            this.gridHeight--;
            if (this.originalImage !== null && this.originalImage !== undefined) {
                this.$refs.xbmConverter.convertToXbm();
            }
        },
        scaleImageUp() {
            this.imageWidth++;
            this.imageHeight++;
            if (this.originalImage !== null && this.originalImage !== undefined) {
                this.$refs.xbmConverter.convertToXbm();
            }
        },
        scaleImageDown() {
            this.imageWidth--;
            this.imageHeight--;
            if (this.originalImage !== null && this.originalImage !== undefined) {
                this.$refs.xbmConverter.convertToXbm();
            }
        },
    }
}
</script>
  
<style scoped>
.xbm-tool-container {
    display: flex;
    flex-wrap: wrap;
}

.input-output-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}

.size-inputs {
    display: flex;
    justify-content: space-between;
}

.size-inputs>* {
    margin: 0.25rem;
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
    align-items: center;
    min-width: 300px;
    flex-direction: column;
}

.card-container>* {
    margin: 0.5rem;
    width: 100%;
}
</style>