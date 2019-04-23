import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
import home from '@/components/home/home'
import index from '@/components/index/index'
// 班级
import checkClass from '@/components/checkClass/checkClass'
// 就业信息
import jobs from '@/components/jobs/jobs'
// 聊天
import chat from '@/components/chat/chat'
// 导入文件
import importFiles from '@/components/importFiles/importFiles'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      hidden: true,
      meta: {
        title: '广现社区教师端登陆'
      }
    },
    {
      path: '/',
      name: 'home',
      hidden: true,
      component: home,
      redirect: '/index',
      children: [
        {
          path: 'index',
          name: '首页',
          component: index,
          meta: {
            title: '首页'
          }
        }
      ],
      meta: {
        title: '首页'
      },
    },
    {
      path: '/',
      name: '学生',
      icon: 'mdi mdi-account-outline',
      component: home,
      children: [
        {
          path: 'checkClass',
          name: '查看学生',
          component: checkClass,
          meta: {
            title: '查看学生'
          }
        }
      ],
      meta: {
        title: '学生'
      },
    },
    {
      path: '/',
      name: '就业',
      hidden: true,
      icon: 'mdi mdi-lightbulb-on-outline',
      component: home,
      children: [
        {
          path: 'job',
          name: '查看就业信息',
          component: jobs,
          meta: {
            title: '查看就业信息'
          }
        }
      ],
      meta: {
        title: '就业'
      },
    },
    {
      path: '/',
      name: '聊天',
      icon: 'mdi mdi-comment-processing-outline',
      component: home,
      children: [
        {
          path: 'chat',
          name: '聊天室',
          component: chat,
          meta: {
            title: '聊天室'
          }
        }
      ],
      meta: {
        title: '聊天室'
      },
    },
    {
      path: '/',
      name: '功能',
      hidden: false,
      icon: 'mdi mdi-settings',
      component: home,
      children: [
        {
          path: 'fn',
          name: '导入文件',
          component: importFiles,
          meta: {
            title: '导入文件'
          }
        }
      ],
      meta: {
        title: '功能'
      },
    },
  ]
})
