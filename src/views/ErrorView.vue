<template>
    <div class="about">
        <p @click="triggerTypeError">触发TypeError</p>
        <el-divider></el-divider>
        <p @click="triggerReferenceError">触发ReferenceError</p>
        <el-divider></el-divider>
        <p @click="triggerSyntaxError">触发SyntaxError</p>
    </div>
</template>

<script setup>
    const triggerTypeError = () => {
        if(testNum.length>0) {
            console.log('ddd')
        }
    }

    const triggerReferenceError = () => {
        throw new ReferenceError('baocuo')       
    }

    const triggerSyntaxError = () => {
        throw new SyntaxError('baocuo')
    }

</script>
