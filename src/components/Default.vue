<template>
    <div>
        <el-row>
            欢迎使用javaApiDocs
        </el-row>
        <el-row :gutter="20">
            <el-col :span="14" :offset="6">
                <el-row>
                    <el-col :span="9" class="text-right">JavaApiDocs源码:</el-col>
                    <el-col :span="15"  class="text-left"><a href="https://github.com/15706058532/JavaApiDocs" target="_blank">https://github.com/15706058532/JavaApiDocs</a></el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" class="text-right">使用文档:</el-col>
                    <el-col :span="15" class="text-left"><a href="https://api.citrsw.com" target="_blank">https://api.citrsw.com</a></el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" class="text-right">演示页面:</el-col>
                    <el-col :span="15" class="text-left"><a href="https://example.citrsw.com/example/citrsw/index.html" target="_blank">https://example.citrsw.com/example/citrsw/index.html</a></el-col>
                </el-row>
                <el-row>
                    <el-col :span="9" class="text-right">演示后端java代码:</el-col>
                    <el-col :span="15" class="text-left"><a href="https://github.com/15706058532/api-example" target="_blank">https://github.com/15706058532/api-example</a></el-col>
                </el-row>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: "Default"
    }
</script>

<style scoped>
    .text-left {
        text-align: left;
    }

    .text-right {
        font-weight: bold;
        text-align: right;
    }
    .el-row{
        margin: 15px 0;
    }
</style>