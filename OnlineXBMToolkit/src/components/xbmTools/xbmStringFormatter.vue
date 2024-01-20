<template>
    <div style="font-family: monospace;">
        <div class="sizeInputs">
            <p class="readonly">
                #define {{ displayedImageName }}_width
            </p>
            <v-text-field class="ml-2 writable" variant="plain" hide-details density :value="displayedWidth"></v-text-field>
        </div>
        <div class="sizeInputs">
            <p class="readonly">
                #define {{ displayedImageName }}_height
            </p>
            <v-text-field class="ml-2 writable" variant="plain" hide-details density
                :value="displayedHeight"></v-text-field>
        </div>
        <p class="readonly">
            static unsigned char {{ displayedImageName }}_bits[] = {
        </p>
        <v-textarea class="writable" v-model="displayedArray" variant="plain" hide-details density hide-spin-buttons
            no-resize rows="4"></v-textarea>
        <p class="readonly" style="margin-top: -4px;"> }; </p>
    </div>
</template>

<script>
const defaultImageName = 'image';
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
        imageName: {
            type: String,
            required: true,
        },
    },
    watch: {
        imageName: function (newVal, oldVal) {
            const regex = /\.\w+$/;
            let tempName = (str => str ? str : defaultImageName)(newVal);

            // remove file extensions
            this.displayedImageName = tempName.replace(regex, '');
        },
    },
    data() {
        return {
            displayedImageName: defaultImageName,
            displayedWidth: null,
            displayedHeight: null,
            displayedArray: null,
        };
    },
    mounted() {
        if (this.imageName === null || this.imageName === '' || this.imageName === undefined) {
            this.displayedImageName = defaultImageName;
        }
        if (this.xbmArray !== null || this.xbmArray !== '' || this.xbmArray !== undefined) {
            this.displayedArray = this.xbmArray;
        }
    },
    methods: {
        xbmArrayToString(xbmArray) {
            return this.xbmArray.map(value => '0x' + value.toString(16).padStart(2, '0')).toString();
        },
    },
};
</script>

<style scoped>
.readonly {
    color: #9E9E9E;
}

.writable {
    color: #9575CD;
}

.sizeInputs {
    display: flex;
    flex-direction: row;
}
</style>