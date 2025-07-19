import axios from 'axios'
import sourceMapJS from 'source-map-js'

const getSourceMap = async (url) => {
    const res = await axios.get(url)
    return res    
}

const findCodeBySourceMap = async(stackFrame) => {
    let fileName = stackFrame.fileName.split('?')[0]
    const sourcemap = await getSourceMap(fileName + '.map')
    const fileContent = sourcemap.data
    const consumer = await new sourceMapJS.SourceMapConsumer(fileContent)
    const originalPosition = consumer.originalPositionFor({
        line: stackFrame.lineNumber,
        column: stackFrame.columnNumber || 0
    })
    const code = consumer.sourceContentFor(originalPosition.source)
    console.log("🚀 ~ findCodeBySourceMap ~ code:", code)
}

export { findCodeBySourceMap }
