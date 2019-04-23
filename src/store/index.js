//引入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

// 加载动画
import { Loading } from 'element-ui'
//使用vuex
Vue.use(Vuex)


const state = {
    friendsListArr: [],
    newMessageArr: [],
    chatList: JSON.parse(localStorage.getItem('chatList')) || [],
}

const getters = {
    getFriendsList () {
        return state.friendsListArr
    },
    getNewMessagesArr () {
        return state.newMessageArr
    },
    getChatList () {
        return state.chatList
    }
}

const actions = {
    /**
     *  登陆环信IM
     */
    DO_Login_IM (ctx, obj) {  

        var imConn = Vue.prototype.$imConn

        Vue.prototype.$imoption.user = obj.username

        imConn.open(Vue.prototype.$imoption)

        imConn.listen({
            onOpened (message) {   // 建立连接
                console.log('%c [opened] 成功连接 ', 'color: green')
                console.log(message)
                // 登陆状态
                imConn.setPresence()
                // 获取好友列表
                imConn.getRoster({
                    success (lists) {
                        console.log('%c *** 好友列表 ***' , 'color: blue')
                        console.log(lists)
                        localStorage.setItem('friendsList', JSON.stringify(lists))
                        localStorage.setItem('myUsername', obj.username)
                        ctx.commit('friendslists', lists)
                    }
                })
            },
            onClosed (message) {  // 连接关闭
                console.log('%c [close] 连接关闭 ', 'color: red')
                console.log(message)
            },

            onTextMessage (message) {  // 接收文本消息
                console.log('%c *** 接收到的文本Text消息 ***', 'color: green')
                console.log(message)
                ctx.commit('recTextMessage', message)
            },
            onEmojiMessage (message) {  // 接收表情
                console.log('%c [emoji] 表情', 'color: yellow')
                console.log(message)
            },
            onPictureMessage (message) {  // 接收图片
                console.log('%c [image] 接收图片', 'color: #2b99ff')
                console.log(message)
                let options = {url: message.url}
                options.onFileDownloadComplete = function (data) {
                    console.log('%c *** 图片下载成功 ***' ,'color: green')
                    console.log(data)
                }
                options.onFileDownloadError = function (err) {
                    console.log('%c *** 图片下载失败 ***', 'color: red')
                    console.log(err)
                }
                Vue.prototype.$WebIM.utils.download.call(Vue.prototype.$imConn, options)
            },

            onRoster (message) { 
                console.log('*** Roster ***')
                console.log(message)
            },
            onError (error) {  // 错误监听
                console.log('%c *** 错误监听 ***', 'color: red')
                console.log(error)
                if (error.data.type == 17) {
                    console.log('%c 用户尚未注册IM,正在前往注册', 'color: red')
                    var options = { 
                        username: obj.username,
                        password: '1',
                        nickname: '',
                        apiUrl: Vue.prototype.$WebIM.config.apiURL,
                        appKey: Vue.prototype.$WebIM.config.appkey,
                        success: function (res) { 
                            console.log('%c 注册成功', 'color: green')
                            console.log(res)
                        },  
                        error: function (err) {
                            console.log('%c 注册失败', 'color: red')
                            console.log(err)
                        },     
                        
                    }; 
                    Vue.prototype.$imConn.registerUser(options);
                }
            }
        })
    },
    sendMessages (ctx, data) {  // 发消息
        Vue.prototype.$imConn.send(data.sendObj.body)
        ctx.commit('meSendMessage', data.meSend)
    }
}

const mutations = {
    friendslists (state, data) {
        state.friendsListArr = data
    },
    recTextMessage (state, data) {  // 接收到的信息
        const newMessage = {
            id:data.id,
            chatType: data.type,
            info: {
                from: data.from,
                to: data.to
            },
            time: Date.parse(new Date()),
            unTeadCunt: 1,
            username: data.from,
            data: data.data
        }
        state.newMessageArr.push(newMessage)
        localStorage.setItem('newMessageArr', JSON.stringify(state.newMessageArr))
        console.log(state.newMessageArr)
        const obj = {
            from: data.from,
            msg: data.data,
            to: localStorage.getItem('myUsername')
        }
        state.chatList.push(obj)
        localStorage.setItem('chatList', JSON.stringify(state.chatList))
    },
    meSendMessage (state, data) {  // 发消息
        state.chatList.push(data)
        localStorage.setItem('chatList', JSON.stringify(state.chatList))
    }
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})