<template>
    <div class="checkClass">
        <div class="search">
            <div class="search-info">
                <input type="text" class="search-info" placeholder="请输入年级编号, 如 2017" v-model="grade" @keyup.enter="search()"><button @click="search()"><i class="mdi mdi-account-search"></i> 搜索</button>
            </div>
        </div>
        <div class="classInfo">
            <div class="row">
                <div class="col-sm-6 col-lg-3" v-for="(item, index) in classList" :key="index">
                    <div class="card">
                        <div class="card-header bg-info">
                            {{item.grade}} 级
                            <span class="card-actions" style="cursor: pointer;" @click="checkClassDetail(item)">班级详情></span>
                        </div>
                        <div class="card-body">
                            <p style="cursor: pointer;" >{{item.className}} <button class="btn btn-xs btn-info" style="float: right;" @click="checkClassStu(item)">查看班级学生</button></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="stu table-responsive">
            <div class="table-title">
                <h4>{{tableTitle}}</h4>
            </div>
            <el-table
                :data="studList"
                center
                border
                style="width: 100%;"
                highlight-current-row
                v-loading="listLoading"
            >
                <el-table-column 
                    label="学号"
                    prop="stuNO"
                />
                <el-table-column
                    label="姓名"
                    prop="stuName"
                />
                <el-table-column
                    label="性别"
                    prop="sex"
                />
                <el-table-column
                    label="电话"
                    prop="telephone"
                />
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <button type="button" class="btn btn-cyan btn-sm" @click="checkStuDetailInfo(scope.$index, scope.row)">详细信息</button>
                        <button type="button" class="btn btn-info btn-sm" @click="jobsInfo(scope.$index, scope.row)">就业信息</button>
                        <button type="button" class="btn btn-success btn-sm" @click="addJobsInfo(scope.$index, scope.row)">添加就业信息</button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-col :span="24">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="paginationInfo.total"
                    :page-size="paginationInfo.pageSize"
                    @current-change="handleCurrentChange"
                >
                </el-pagination>
            </el-col>
        </div>

        <!-- 班级详情 -->
        <el-dialog
            :title="classDetailInfo.className"
            :visible.sync="classDetailShow"
            width="30%"
            >
            <div class="classDetail">
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr class="text-center">
                            <td>学院</td>
                            <td>辅导员</td>
                            <td>年级</td>
                            <td>班级</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="text-center">
                            <td>{{classDetailInfo.colName}}</td>
                            <td>{{classDetailInfo.teaName}}</td>
                            <td>{{classDetailInfo.grade}}</td>
                            <td>{{classDetailInfo.className}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="classDetailShow = false">取 消</el-button>
                <el-button type="primary" @click="classDetailShow = false">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 学生详细信息 -->
        <el-dialog
            title="学生详细信息"
            :visible.sync="stuDetaileInfoShow"
            width="30%"
            >
            <div class="stuDetail">
                <ul class="list-group"  v-loading="listLoading">
                    <li class="list-group-item">
                        <span style="font-weight: bold; width: 23%; display: inline-block;">班级：</span>{{stuDetaileInfo.className}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">学号：</span>{{stuDetaileInfo.stuNO}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">姓名：</span>{{stuDetaileInfo.stuName}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">性别：</span>{{stuDetaileInfo.sex}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">身份证：</span>{{stuDetaileInfo.idCard}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">身份：</span>{{stuDetaileInfo.polStatus}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">民族：</span>{{stuDetaileInfo.nationName}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">户口所在地：</span>{{stuDetaileInfo.accountLoc}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">户口类型：</span>{{stuDetaileInfo.accountType}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">家庭地址：</span>{{stuDetaileInfo.familyAdd}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">文化程度：</span>{{stuDetaileInfo.eduLevel}}
                    </li>
                    <li class="list-group-item">
                        <span style="font-weight: bold;width: 23%; display: inline-block;">毕业中学：</span>{{stuDetaileInfo.graSchool}}
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stuDetaileInfoShow = false">取 消</el-button>
                <el-button type="primary" @click="stuDetaileInfoShow = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 就业详细信息 -->
        <el-dialog
            title="就业详细信息"
            :visible.sync="stuJobsDetailInfoShow"
            width="60%"
            size="small"
            >
            <div class="jobsDetail">
                <el-table
                    :data="stuJobsDetailInfo"
                    
                    style="width: 100%;"
                    highlight-current-row
                    v-loading="listLoading"
                >
                    <el-table-column 
                        label="姓名"
                        prop="stuName"
                    />
                    <el-table-column
                        label="电话"
                        prop="telephone"
                    />
                    <el-table-column
                        label="性别"
                        prop="sex"
                    />
                    <el-table-column
                        label="开始工作时间"
                        prop="graStartTime"
                    />
                    <el-table-column
                        label="结束工作时间"
                        prop="graEndTime"
                    />
                    <el-table-column
                        label="公司名称"
                        prop="graCompany"
                    />
                    <el-table-column
                        label="职位"
                        prop="graPost"
                    />
                    <el-table-column
                        label="薪资"
                        prop="pay"
                    />
                    <el-table-column
                        label="公司详细地址"
                        prop="graAddress"
                    />
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stuJobsDetailInfoShow = false">取 消</el-button>
                <el-button type="primary" @click="stuJobsDetailInfoShow = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加就业信息 -->
        <el-dialog
            title="添加就业信息"
            :visible.sync="addJobsShow"
            width="40%"
            >
            <div class="addJobsDetail">
                <el-form :model="addJobs" label-width="80px" ref="form">
                    <el-form-item label="公司名称">
                        <el-input v-model="addJobs.graCompany"></el-input>
                    </el-form-item>
                    <el-form-item label="职位">
                        <el-input v-model="addJobs.graPost"></el-input>
                    </el-form-item>
                    <el-form-item label="薪资">
                        <el-input v-model="addJobs.pay"></el-input>
                    </el-form-item>
                    <el-form-item label="起始时间">
                        <el-col :span="11">
                            <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="addJobs.graStartTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-col :span="11">
                            <el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="addJobs.graEndTime" style="width: 100%;"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="公司地址">
                        <el-input type="textarea" v-model="addJobs.graAddress"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addJobsShow = false">取 消</el-button>
                <el-button type="primary" @click="postAddJobsInfo()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'checkClass',
    data () {
        return {
            userInfo: null,
            grade: '',
            classList: [],

            classDetailShow: false,
            listLoading: false,
            classDetailInfo: {},  // 班级详细信息
            tableTitle: '',  // 学生列表标题
            classUUID: '',  // 班级ID
            studList: [  // 学生列表
               
            ],
            paginationInfo: {
                pageNum: 1,    // 当前页数
                pageSize: 10,  // 显示数据
                total: 1,   // 总数
            },
            stuDetaileInfoShow: false,
            stuDetaileInfo: {},  // 学生详细信息
            stuJobsDetailInfoShow: false,
            stuJobsDetailInfo: [],  // 学生就业信息
            addJobsShow: false,
            addJobs: { // 就业信息
                stuUUID: '',  // 学生编号
                graStartTime: '',   // 起始时间
                graEndTime: '',   // 结束时间
                graCompany: '',  // 公司名称
                graPost: '',   // 职位
                pay: '',  // 薪资
                graAddress: '' ,  // 公司地址
            },  

        }
    },
    methods: {

        search () {
            if (this.grade != '') {
                this.$loading({
                    lock: 'true',
                    text: '搜索中...',
                })

                const paramsObj = {
                    teaUUID: this.userInfo.teaUUID,
                    grade: this.grade
                }

                this.$server.checkClass(paramsObj).then((res) => {
                    console.log(res)
                    if (res.length != 0) {
                        this.$loading().close()
                        console.log(res)
                        this.classList = res
                    } else {
                        this.$message({
                            message: '暂无班级',
                            type: 'success'
                        });
                        this.$loading().close()
                        return
                    }
                }).catch((err) => {
                    console.log(err)
                    this.$message.error('不好意思服务器开小差了！');
                    this.$loading().close()
                })
            } else {

                this.$message({
                    message: '请输搜索的年级',
                    type: 'warning'
                });
                return

            }
        },

        checkClassDetail (item) {  // 查看班级详情
            this.classDetailShow = true
            console.log(item)
           
            this.$server.checkClassDetail(item).then((res) => {
                console.log(res)
                if (res) {
                    this.classDetailInfo = res
                }
            }).catch((err) => {
                console.log(err)
            })
        },

        checkClassStu (item) { // 查看班级学生
            this.tableTitle = item.className
            this.classUUID = item.classUUID
            // 默认第一页
            const params = {
                classUUID: item.classUUID,
                pageNum: 1
            }
            this.getStudList(params)
            
        },

        handleCurrentChange (val) {  // 分页
            console.log(val)

            const params = {
                classUUID: this.classUUID,
                pageNum: val
            }

            this.getStudList(params)
        },

        checkStuDetailInfo (index, item) {  // 学生详细信息
            this.stuDetaileInfoShow = true
            this.$server.getStuDetailInfo(item).then((res) => {
                console.log(res)
                if (res) {
                    if (res.sex) {  // 性别  0男 1女
                        res.sex = '男'
                    } else {
                        res.sex = '女'
                    }
                    /**
                     * 户口类型
                     * 城镇户口：0 false
                     * 农村户口：1 true
                     */
                    if (res.accountType) {
                        res.accountType = '农村户口'
                    } else {
                        res.accountType = '城镇户口'
                    }
                    /**
                     * 文化程度
                     * 中专：0  false
                     * 高中：1  true
                     */
                    if (res.eduLevel) {
                        res.eduLevel = '高中'
                    } else {
                        res.eduLevel = '中专'
                    }
                    /**
                     * 0 群众
                     * 1 共青团
                     * 2 党员
                     * 3 中共预备党员
                     */
                    if (res.polStatus == 1) {
                        res.polStatus = '共青团'
                    } else if (res.polStatus == 2) {
                        res.polStatus = '党员'
                    } else if (res.polStatus == 3) {
                        res.polStatus = '中共预备党员'
                    } else {
                        res.polStatus = '群众'
                    }
                    this.stuDetaileInfo = res
                    console.log(this.stuDetaileInfo)
                }
            })
        },

        jobsInfo (index, item) {  // 就业信息
            this.stuJobsDetailInfoShow = true
            this.listLoading = true
            this.$server.getStuJobsInfo(item).then((res) => {
                
                if (res.length != 0) {
                    this.listLoading = false
                    res.forEach((item, index) => { 
                        // 性别
                        if (item.sex) {
                            item.sex = '男'
                        } else {
                            item.sex = '女'
                        }
                        // 时间转换
                        item.graStartTime = this.formatDate(item.graStartTime)
                        item.graEndTime = this.formatDate(item.graEndTime)
                    })
                    
                    this.stuJobsDetailInfo = res
                    console.log(this.stuJobsDetailInfo)
                } else {
                    this.listLoading = false
                }
            })
        },

        addJobsInfo (index, item) {  // 添加就业信息
            this.addJobsShow = true
            this.addJobs.stuUUID = item.stuUUID
        },
        postAddJobsInfo () {
            if (this.addJobs.graCompany == '') {
                this.errTips('请输入公司名称')
                return
            } else if (this.addJobs.graPost == '') {
                this.errTips('请输入职位')
                return
            } else if (this.addJobs.pay == '') {
                this.errTips('请输入薪资')
                return
            } else if (this.addJobs.graStartTime == '') {
                this.errTips('请输入工作起始时间')
                return
            } else if (this.addJobs.graEndTime == '') {
                this.errTips('请输入工作结束时间')
                return
            } else if (this.addJobs.graAddress == '') {
                this.errTips('请输入公司地址')
                return
            } else {
                var params = new URLSearchParams
                params.append('stuUUID', this.addJobs.stuUUID)
                params.append('graStartTime', this.addJobs.graStartTime)
                params.append('graEndTime', this.addJobs.graEndTime)
                params.append('graCompany', this.addJobs.graCompany)
                params.append('graPost', this.addJobs.graPost)
                params.append('pay', this.addJobs.pay)
                params.append('graAddress', this.addJobs.graAddress)
                console.log(this.addJobs)
                // 加载动画
                this.$loading({
                    lock: true,
                    text: 'Loading'
                })

                this.$server.addJobInfo(params).then((res) => {
                    console.log(res)
                    if (res != '') {
                        this.$loading().close()
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        // 关闭Modal
                        this.addJobsShow = false
                        // 清空val
                        this.addJobs.stuUUID = ''
                        this.addJobs.graStartTime = ''
                        this.addJobs.graEndTime = ''
                        this.addJobs.graCompany = ''
                        this.addJobs.graPost = ''
                        this.addJobs.pay = ''
                        this.addJobs.graAddress = ''
                    } else {
                        this.errTips('添加失败')
                        this.$loading().close()
                        return
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        getStudList (params) {  // 获取学生列表
            this.listLoading = true
            this.$server.checkClassStuLists(params).then((res) => {
                console.log(res)
                if (res) {
                    this.listLoading = false

                    this.paginationInfo.pageNum = res.pageNum 
                    this.paginationInfo.pageSize = res.pageSize
                    this.paginationInfo.total = res.total
                    res.list.forEach((item, index) => {
                        if (item.sex) {
                            item.sex = '男'
                        } else {
                            item.sex = '女'
                        }
                    })
                    this.studList = res.list
                    
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        formatDate (val) {  /* 格式化时间戳 */
            const date = new Date(val);
            const year = date.getFullYear();
            const month = date.getMonth() > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
            const day = date.getDate() > 9 ? date.getDate() + 1 : `0${date.getDate() + 1}`;
            return `${year}-${month}-${day}`;
        },
        errTips (tips) {  // 错误提示
            this.$message.error(tips)
        }
    },
    created () {
        // 获取用户信息
        if (sessionStorage.getItem('user')) {
            this.userInfo = JSON.parse(sessionStorage.getItem('user')) || null
        }
        
    }
}
</script>

<style scoped>
.search {
    box-sizing: border-box;
    padding: 15px;
    background: #fff;
    border: 1px solid #ddd;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.11);
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}
.search-info input{
    padding: 5px 12px;
    min-width: 200px;
    outline: none;
}
.search-info button {
    padding: 6px 12px;
    border: 1px solid #2b99ff;
    background: #2b99ff;
    color: #fff;
}
.stu {
    padding: 15px;
    background: #fff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.11);
}
</style>
