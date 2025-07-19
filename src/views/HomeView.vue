<script setup>
    import { onMounted, ref } from 'vue';
    const activeName = ref(['1'])
    let js_error = ref(null)
    let isError = ref(false)
    onMounted(() => {
        try {
            let jsErrorList = localStorage.getItem('jsErrorList')
            if(jsErrorList){
                isError.value = true
                js_error.value = JSON.parse(jsErrorList)
            }
        } catch (error) {
            console.error('error', error)
        }
    })
</script>

<template>
    <div v-if="isError">
        <pre>
            {{ js_error.stack }}
        </pre>
        <el-collapse v-model="activeName" accordion>
        <el-collapse-item
            v-for="(item, index) of js_error.stack_frames"
            :key="index"
            :name="index"
            :title="item.source" 
        >
            <el-row :gutter="20">
                <el-col :span="20">
                    {{ item.fileName }}
                </el-col>
                <el-col :span="4">
                    <el-button>
                        dddd
                    </el-button>
                </el-col>
            </el-row>
        </el-collapse-item>
        </el-collapse>
    </div>
</template>



