import axios from 'axios'

// http requser 拦截器
axios.interceptors.request.use((config) => {
    return config
}, (err) => {
    alert('请求超时')
    return Promise.resolve(err)
})

// 响应拦截， 异常处理
axios.interceptors.response.use((data) => {
    return data
}, (err) => {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                alert('错误请求')
            break;
            case 401:
                alert('未授权，请重新登录')
                break;
            case 403:
                alert('拒绝访问')
                break;
            case 404:
                alert('请求错误,未找到该资源')
                break;
            case 405:
                alert('请求方法未允许')
                break;
            case 408:
                alert('请求超时')
                break;
            case 500:
                alertalert('服务器端出错')
                break;
            case 501:
                alert('网络未实现')
                break;
            case 502:
                alert('网络错误')
                break;
            case 503:
                alert('服务不可用')
                break;
            case 504:
                alert('网络超时')
                break;
            case 505:
                alert('http版本不支持该请求')
                break;
            default:
                alert(`连接错误${err.response.status}`)
        }
    } else {
        alert('服务器连接失败')
    }
})

/**
 *  封装 get 方法
 *  @returns { Promise }
 */

 export function get(url, params = {}) {
     return new Promise((resolve, rejects) => {
         axios.get(url).then((res) => {
             resolve(res.data)
         }).catch((err) => {
             rejects(err)
         })
     })
 }

 /**
  *  封装 post 方法
  *  @returns { Promise }
  */

  export function post(url, params ={}) {
      return new Promise((resolve, reject) => {
          axios.post(url, params).then((res) => {
              resolve(res.data)
          }).catch((err) => {
              reject(err)
          })
      })
  } 

  /**
   *  获取接口方法
   */

   export const server = {
       /**
        * 
        * @param {Object} paramsObj  登录 
        * method POST
        * 字段 telephone & Password
        */
       login (paramsObj) {
           return post('/consumer/teacher/teacherAdmin/login', paramsObj)
       },
       /**
        * 
        * @param {Object} paramsObj  修改密码 
        * method POST
        * 字段 telephone & newPassword
        */
       changePwd (paramsObj) {
           return post('/consumer/teacher/teacherAdmin/update', paramsObj)
       },
       /**
        * 
        * @param {object} paramsObj  查看教师所带的班级
        * method GET
        * 字段 teaUUID：教师编号 & grade：年级
        */
       checkClass (paramsObj) {
           return get('/consumer/teacher/teacher/list/'+paramsObj.teaUUID+'/'+ paramsObj.grade)
       },
       /**
        * 
        * @param {Object} paramsObj   查看班级详情
        * method GET
        * 字段 classUUID
        */
       checkClassDetail (paramsObj) {
            return get('/consumer/teacher/classInfo/get/'+ paramsObj.classUUID)
       },
       /**
        * 
        * @param {Object} paramsObj  分页查询获取学生信息列表
        * methods get
        * 字段 classUUID & pageNum
        */
       checkClassStuLists (paramsObj) {
            return get('/consumer/teacher/student/list/'+paramsObj.classUUID + '/' + paramsObj.pageNum )
       },
       /**
        * 
        * @param {Object} paramsObj   获取学生详细信息
        * method GET
        * 字段 stuUUID 
        */
       getStuDetailInfo (paramsObj) {
            return get('/consumer/teacher/student/get/'+paramsObj.stuUUID)
       },
       /**
        * 
        * @param {Object} paramsObj  查看学生就业信息
        * method GET
        * 字段 stuUUID
        */
       getStuJobsInfo (paramsObj) {
           return get('/consumer/teacher/job/get/' + paramsObj.stuUUID)
       },
       /**
        * 
        * @param {Object} paramsObj 添加学生就业信息
        * method post
        * 字段：很多
        * 
        */
       addJobInfo (paramsObj) {
            return post('/consumer/teacher/job/add', paramsObj)
       },
       /**
        * 
        * @param {Object} paramsObj 根据教师的UUID获取班级信息
        * method get 
        * 字段 
        * teaUUID
        */
       getClassInfoByTeaUUID (paramsObj) {
            return get('/consumer/teacher/teacher/listByTeaUUID/'+paramsObj.teaUUID)
       }    
   }