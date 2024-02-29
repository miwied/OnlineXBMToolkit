<template>
    <!-- c-code -->
    <div style="font-family: monospace;" v-if="formatTypeSelected === formatTypeSelection[0]">
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
        <v-textarea class="writable" v-model="modifiableText" hide-details density hide-spin-buttons
            auto-grow="true"></v-textarea>
        <p class="readonly" style="margin-top: -4px;"> }; </p>
    </div>
    <div style="font-family: monospace;" v-else>
        <v-textarea class="writable" v-model="modifiableText" hide-details density hide-spin-buttons no-resize rows="8.5"
            spellcheck="false"></v-textarea>
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
        formatTypeSelected: {
            type: String,
            required: true
        },
        formatTypeSelection: {
            type: Array,
            required: true
        },
    },
    emits: ['update-array', 'update-width', 'update-height'],
    watch: {
        xbmArray: function (newVal, oldVal) {
            this.updateString();
        },
        formatTypeSelected: function (newVal, oldVal) {
            this.updateString();
        },
        modifiableText: function (newVal, oldVal) {
            // this.$emit("update-array", this.xbmStringToArray(this.modifiableText));
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
            modifiableText: null,
        };
    },
    mounted() {
        // this.modifiableWidth = this.gridWidth.toString();
        // this.modifiableHeight = this.gridHeight.toString();
    },
    methods: {
        updateString() {
            switch (this.formatTypeSelected) {
                // c-code
                case this.formatTypeSelection[0]:
                    this.modifiableText = this.getCArray();
                    break;
                // c-bytes
                case this.formatTypeSelection[1]:
                    this.modifiableText = this.getCArray();
                    break;
                // js-bytes
                case this.formatTypeSelection[2]:
                    console.log(this.xbmArray);
                    this.modifiableText = this.getJsArray();
                    break;
                // json-bytes
                case this.formatTypeSelection[3]:
                    this.modifiableText = this.getCArray();
                    break;
                default:
                    console.error("Format type selection error. Selected format", this.formatTypeSelected);
                    break;
            }
        },
        splitBytes(inputString) {
            const bytesArray = inputString.toString().split(',');

            const regex = /.{1,47}(,|$)/g;
            const matchedGroups = bytesArray.join(',').match(regex);
            return matchedGroups.join('\n');
        },
        getCCode() {
            return `#define ${this.displayedImageName}_width ${this.gridWidth}\n#define ${this.displayedImageName}_height ${this.gridHeight}\nstatic unsigned char ${this.displayedImageName}_bits[] = {\n${this.splitBytes(this.xbmArray)} \n};`
        },
        getCArray() {
            return this.xbmArray
                .map((num, index) => {
                    const hex = '0x' + num.toString(16).padStart(2, '0').toUpperCase();
                    return (index % 9 === 8) ? hex + ",\n" : hex + ",";
                })
                .join('');
        },
        getJsArray() {
            return this.xbmArray
                .map((num, index) => {
                    const hex = '0x' + num.toString(16).padStart(2, '0').toUpperCase();
                    return (index % 9 === 8) ? hex + ",\n" : hex + ",";
                })
                .join('');
        },
        getJasonArray() {

        }
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