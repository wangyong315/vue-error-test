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
                    <el-button type="primary" size="small" @click="openDialog(item,index)">
                        映射源码
                    </el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <template v-if="item.origin">
                    {{ item.origin }}
                    if <Preview :origin="item.origin" />
                </template>
                <template v-else>
                   else {{ item.fileName }}
                </template>
            </el-row>
        </el-collapse-item>
        </el-collapse>
        <el-dialog
            v-model="dialogVisible"
            title="SourceMap源码映射"
            width="500"
        >
            <el-tabs v-model="tabActiveName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="本地上传" name="local">
                    <el-upload drag :before-upload="sourceUpload">
                        <i class="el-icon-upload"></i>
                        <div>将文件拖到此处,或者点击上传</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="远程加载" name="request">
                    远程加载
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script setup>
    import sourceMapJS from 'source-map-js'
    import { onMounted, ref } from 'vue';
    import Preview from "./Preview.vue";
    import { ElMessage } from "element-plus";
    
    const activeName = ref(['1'])
    const tabActiveName = ref('local')
    const dialogVisible = ref(false)
    let js_error = ref(null)
    let isError = ref(false)
    let stackFramesObj = {
        line: 0,
        column: 0,
        index: 0
    }
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

    const openDialog = (item, index) => {
        dialogVisible.value = true
        stackFramesObj = {
            line: item.lineNumber,
            column: item.columnNumber,
            index: index
        }
    }

    const sourceUpload = async (file) => {
        console.log("🚀 ~ sourceUpload ~ file:", file)
        if(!file.name.endsWith('.map')) {
            ElMessage.error('请上传正确的map文件')
            return
        }
        const reader = new FileReader()
        reader.readAsText(file, 'utf-8')   
        reader.onload = async(evt) => {
            console.log("🚀 ~ reader.onload=async ~ evt:", evt)
            const code = await getSource(evt.target.result, stackFramesObj.line, stackFramesObj.column)
            console.log("🚀 ~ reader.onload=async ~ code:", code)
            // js_error.stack_frames
            console.log("🚀 ~ reader.onload=async ~ js_error:", js_error.value)
            js_error.value.stack_frames[stackFramesObj.index].origin = code
            dialogVisible.value = false
        }
    }

    const getSource = async(sourcemap, line, column) => {
        try {
            const consumer = await new sourceMapJS.SourceMapConsumer(JSON.parse(sourcemap))
            const originPosition = consumer.originalPositionFor({
                line: line,
                column: column
            })
            const source = consumer.sourceContentFor(originPosition.source)
            return {
                source,
                line: originPosition.line,
                column: originPosition.column,
            }
        } catch (error) {
            ElMessage.error('sourcemap获取失败')            
        }
    }

</script>
