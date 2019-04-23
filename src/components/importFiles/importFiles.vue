<template>
    <div class="importFiles">
        <div class="row">
            <div class="col-sm-6 col-lg-6">
                <div class="card">
                    <div class="card-header bg-info">
                        学生成绩操作
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <button type="button" class="btn btn-info" @click="importScore">导入学生成绩</button>
                        </div>
                        <div class="form-group">
                            <h5 class=" text-info">下载学生成绩</h5>
                        </div>
                        <el-table
                            :data="classList"
                            style="width: 100%;"
                            highlight-current-row
                            border
                            v-loading="isLoading"
                        >
                            <el-table-column 
                                label="班级"
                                prop="className"
                            />
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <a :href="'http://192.168.22.46:8003/score/download/'+scope.row.classUUID">
                                        下载 <i class="mdi mdi-download"></i>
                                    </a>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-lg-6">
                <div class="card">
                    <div class="card-header ">
                        学生信息操作
                        <div class="card-actions">
                            <a href="http://192.168.22.46:8003/student/download">
                                <span>
                                    <i class="mdi mdi-download"></i>
                                    学生信息模板下载
                                </span>
                            </a>
                        </div>
                    </div>
                    <div class="card-body">
                        <el-table
                            :data="classList"
                            style="width: 100%;"
                            highlight-current-row
                            border
                            v-loading="isLoading"
                        >
                            <el-table-column 
                                label="班级"
                                prop="className"
                            />
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <button class="btn btn-info" @click="importInfo(scope.row)">导入学生信息表</button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
        <!-- 导入学生成绩 -->
        <el-dialog
            title="导入学生成绩"
            :visible.sync="importScoreFileShow"
            width="30%"
            >
            <div class="classDetail">
                <form ref="upScoreFile">
                    <div class="form-group">
                        <input type="file" name="multipartFile">
                    </div>
                    <div class="form-group">
                        <p>注意事项: 文件格式只能为: <strong>.xls，.xlsx</strong></p>
                    </div>
                </form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importScoreFileShow = false">取 消</el-button>
                <el-button type="primary" @click="upScFile">上传到服务器</el-button>
            </span>
        </el-dialog>
        <!-- 导入学生信息 -->
        <el-dialog
            title="导入学生信息"
            :visible.sync="importInfoFileShow"
            width="30%"
            >
            <div class="classDetail">
                <form ref="updateInfoFile">
                    <div class="form-group">
                        <input type="file" name="multipartFile">
                        <input type="hidden" name="classUUID" v-model="infoFiel.classUUID">
                    </div>
                    <div class="form-group">
                        <p>注意事项: 文件格式只能为: <strong>.xls，.xlsx</strong></p>
                    </div>
                </form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="importInfoFileShow = false">取 消</el-button>
                <el-button type="primary" @click="upInfoFile()">上传到服务器</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'importFiles',
    data () {
        return {
            teaInfo: {},
            classList: [],
            isLoading: false,
            activeNames: ['0'],
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            importScoreFileShow: false,
            importInfoFileShow: false,
            infoFiel: {},
        }
    },
    methods: {
        upInfoFile () {  // 上传信息表到服务器
            const formData = new FormData(this.$refs.updateInfoFile)
            axios.post('/consumer/teacher/student/import', formData, this.headers).then((res) => {
                console.log(res)
                if (res == undefined) {
                    this.$message.error('文件上传失败，请检查文件格式');
                    return
                } else if (res.data){
                    this.$message({
                        message: '文件上传成功',
                        type: 'success'
                    });
                    this.importInfoFileShow = false
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        importInfo (item) {  // 上传信息表
            console.log(item)
            this.infoFiel = item
            this.importInfoFileShow = true
        },
        importScore () {  // 上传成绩表 
            this.importScoreFileShow = true
        },
        upScFile () {  // 上传成绩表 
            var formData = new FormData(this.$refs.upScoreFile)
            axios.post('/consumer/teacher/teacher/import', formData, this.headers).then((res) => {
                console.log(res)
                if (res == undefined) {
                    this.$message.error('文件上传失败，请检查文件格式');
                    return
                } else if (res.data){
                    this.$message({
                        message: '文件上传成功',
                        type: 'success'
                    });
                    this.importScoreFileShow = false
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        handleChange (val) {
            console.log(val);
        },
        getClassInfo () {  // 获取班级
            this.isLoading = true
            this.$server.getClassInfoByTeaUUID(this.teaInfo).then((res) => {
                console.log(res)
                if (res.length != 0) {
                    this.classList = res
                    this.isLoading = false
                } 
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    created () {
        // 获取教师信息
        this.teaInfo = JSON.parse(sessionStorage.getItem('user'))
        // 获取教师班级信息
        this.getClassInfo()
    }
}
</script>

<style scoped>

</style>
