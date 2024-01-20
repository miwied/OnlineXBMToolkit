<template>
    <div style="font-family: monospace;">
        <div class="sizeInputs">
            <p class="readonly">
                #define {{ displayedImageName }}_width
            </p>
            <v-text-field class="ml-2 writable" variant="plain" hide-details density
                v-model="modifiableWidth"></v-text-field>
        </div>
        <div class="sizeInputs">
            <p class="readonly">
                #define {{ displayedImageName }}_height
            </p>
            <v-text-field class="ml-2 writable" variant="plain" hide-details density
                v-model="modifiableHeight"></v-text-field>
        </div>
        <p class="readonly">
            static unsigned char {{ displayedImageName }}_bits[] = {
        </p>
        <v-textarea class="writable" v-model="modifiableArray" variant="plain" hide-details density hide-spin-buttons
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
    emits: ['update-array', 'update-width', 'update-height'],
    watch: {
        xbmArray: function (newVal, oldVal) {
            let arrayString = this.xbmArrayToString(newVal);
            if (!this.xbmStringsAreEqual(this.modifiableArray, arrayString)) {
                this.modifiableArray = arrayString;
            }
        },
        modifiableArray: function (newVal, oldVal) {
            this.$emit("update-array", this.xbmStringToArray(this.modifiableArray));
        },
        gridWidth: function (newVal, oldVal) {
            if (this.modifiableWidth != newVal) {
                this.modifiableWidth = newVal;
            }
        },
        modifiableWidth: function (newVal, oldVal) {
            this.$emit("update-width", this.modifiableWidth);
        },
        gridHeight: function (newVal, oldVal) {
            if (this.modifiableHeight != newVal) {
                this.modifiableHeight = newVal;
            }
        },
        modifiableHeight: function (newVal, oldVal) {
            this.$emit("update-height", this.modifiableHeight);
        },
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
            modifiableWidth: null,
            modifiableHeight: null,
            modifiableArray: null,
        };
    },
    mounted() {
        this.modifiableWidth = this.gridWidth.toString();
        this.modifiableHeight = this.gridHeight.toString();
        this.modifiableArray = this.xbmArrayToString(this.xbmArray);
    },
    methods: {
        xbmArrayToString(xbmArray) {
            return this.xbmArray.map(value => '0x' + value.toString(16).padStart(2, '0')).toString();
        },
        xbmStringToArray(xbmString) {
            let hexValues = xbmString.split(',');
            return hexValues.map(hexValue => parseInt(hexValue.trim(), 16));
        },
        xbmStringsAreEqual(xbmString1, xbmString2) {
            if (xbmString1.length !== xbmString2.length) {
                return false;
            }

            for (let i = 0; i < xbmString1.length; i++) {
                if (xbmString1[i] !== xbmString2[i]) {
                    return false;
                }
            }

            return true;
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