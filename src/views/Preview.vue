<template>
    <div class="pre-code">
        <div class="error-detail">
            <div class="error-code" v-html="preLine()"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Preview',
        props: {
            origin: Object,
        },
        methods: {
            preLine(){
                const line = this.origin.line
                console.log("🚀 ~ preLine ~ origin:", this.origin)
                const originCodeLine = this.origin.source.split('/n')
                const len = originCodeLine.length-1
                const start = len-3>=0 ? line-3 : 0
                const end = start+5 > len ? len : start+5
                let newLines = []
                for(let i=start;i<=end;i++){
                    const content = i+1 + '.  ' + this.encodeHTML(originCodeLine[i])
                    newLines.push(
                        `<div class='code-line ${i+1 == line ? 'heightlight' : ''}'${content}></div>`
                    )

                }
                console.log("🚀 ~ preLine ~ newLines:", newLines)
                return newLines?.join('')
            },
            encodeHTML(str){
                if(!str || str.length === 0) return ''
                return str
                        .replace(/&/g, '&#38;') 
                        .replace(/</g, '&lt;') 
                        .replace(/>/g, '&gt;') 
                        .replace(/'/g, '&#39;') 
            }
        }
    }
</script>

<style scoped>
.pre-code .err-detail .error-code {
    padding: 10px;
    overflow: hidden;
    word-wrap: normal;
}

.code-line {
    padding: 4px;
}
.heightlight {
    color: #fff;
    background-color: red;
}
</style>

