<template>
    <div class="chat">
        <div class="chat-friends-list">
            <ul v-if="friendsLists.length != 0">
                <li class="list-item" :class="{'select':classIndex == index}" v-for="(item, index) in friendsLists" :key="index" @click="intoChatRoom(item, index)">
                    <div class="userAvater">
                        <i class="mdi mdi-account-circle"></i>
                    </div>
                    <div class="content">
                        <div class="info">
                            <span class="username">{{item.name}}</span>
                            <span class="date" v-if="item.date">2019/04/14</span>
                        </div>
                        <div class="rp">
                            <span class="rp-mesg" v-if="item.rp">哈哈哈</span>
                            <!-- <span class="badge" style="background-color: #f96868;">99+</span> -->
                        </div>
                    </div>
                </li>
            </ul>
            <div class="no-firends text-center" v-else>
                <p>当前没有历史聊天，添加一个好友开始聊天吧</p>
            </div>
        </div>
        <div class="chat-content" >
            
            <div class="x-chat">
                <div class="x-chat-header">
                    <div class="f-left">
                        <span style="font-weight: bold;">{{toUserName}}</span>
                    </div>
                    <div class="f-right">
                        
                    </div>
                </div>

                <div class="x-chat-content"  v-if="friendsLists.length != 0" id="info">
                    <div v-for="(item, index) in getChatListArr" :key="index">
                        <div class="x-messages-group" v-if="item.from == toUserName">
                            <div class="messages-content">
                                <div class="messages-text">
                                    <span>{{item.msg}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="x-messages-group x-messages-me" v-if="item.from == myName && item.to == toUserName">
                            <div class="messages-content">
                                <div class="messages-text">
                                    <span>{{item.msg}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="x-chat-footer">
                    <div style="position: relative; height: 150px;">
                        <div class="x-chat-ops">
                            <span class="mdi mdi-file-image"></span> <span class="mdi mdi-file"></span>
                        </div>
                        <div class="x-chat-send">
                            <div class="send">
                                <textarea placeholder="请输入消息" v-model="message" @keyup.enter="sendMessage()"></textarea>
                            </div>
                            <div class="send-btn text-right">
                                <button type="button" class="btn btn-info btn-sm" @click="sendMessage()">发送消息</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import websdk from 'easemob-websdk'
let WebIM = window.WebIM = websdk

export default {
    name: 'chat',
    data () {
        return {
            classIndex: -99,
            message: '',  // 发送消息内容
            friendsLists: [],
            toUserName: '',
            myName: localStorage.getItem('myUsername') || '',
        }
    },
    mounted () {
        
    },
    methods: {
        intoChatRoom (item,index) {
            this.classIndex = index
            console.log(item)
            this.toUserName = item.name
            var oInfo = document.getElementById("info")
            oInfo.scrollTop = oInfo.scrollHeight
        },
        sendMessage() {  // 发送消息
            
            if (this.message != '') {
                var id = this.$imConn.getUniqueId()   // 生成本地消息id
                var msg = new WebIM.message('txt', id)  // 创建文本消息
                msg.set({
                    msg: this.message,
                    to: this.toUserName,
                    roomType: false,
                    success (id, serverMsgId) {  
                        console.log(id)
                        console.log(serverMsgId)
                    },
                    fail (e) {
                        console.log("Send private text error")
                    }
                })
                const obj = {
                    meSend: {
                        from: this.myName,
                        msg: this.message,
                        to: this.toUserName,
                    },
                    sendObj: msg
                }
                this.$store.dispatch('sendMessages', obj)
                this.message = ''
                var oInfo = document.getElementById("info")
                oInfo.scrollTop = oInfo.scrollHeight
            } else {
                this.$message.error('请输入发送的内容');
                return
            }
        },
        getChatList() {  // 处理好友列表
            var array = []
            var member = this.getFriendsList || JSON.parse(localStorage.getItem('friendsList'))
            var myName = localStorage.getItem('myUsername') || this.getFriendsList
            for (let i = 0; i < member.length; i++) {
                let newChatMsgs = (member[i].name + myName) || [];
                member[i].toUserId = this.strSplit(member[i].jid)
            }
            console.log(member)
            this.friendsLists = member
        },
        strSplit (jid) {
            var str = jid || ''
            var arr = str.split('_')
            var b = arr[1].split('@')
            var id = b[0]
            return id
        }
    },
    computed: {
        getFriendsList () {  // 获取好友列表
            return this.$store.getters.getFriendsList
        },
        getNewMessageArr () {  // 获取新消息
            return this.$store.getters.getNewMessagesArr || JSON.parse(localStorage.getItem('newMessageArr'))
        },
        getChatListArr () {
            return this.$store.getters.getChatList || JSON.parse(localStorage.getItem('chatList'))
        },
        getClientHeight () {  // 获取可视化窗口高度
            var clientHeight=0;
            if(document.body.clientHeight&&document.documentElement.clientHeight)
            {
            var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
            }
            else
            {
            var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
            }
            return clientHeight - 300
        }
    },
    created () {
        console.log('getChatList')
        this.getChatList()
        
        
    }
}
</script>

<style scoped>
.chat {
    display: flex;
    flex-direction: row;
    background: #fff;
    border: 1px solid #ddd;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.11);
    overflow: hidden;
    position: relative;
    overflow: auto;
    height: 800px;
}
/* 聊天 */
.chat-content {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 300px;
    bottom: 0;
    right: 0;
}
.x-messages-group {
    display: flex;
    padding: 15px;
    cursor: pointer;
}
.messages-user {
    font-size: 30px;
    color: #2b99ff;
}
.messages-content {
    padding: 5px;
    background: #ddd;
    border-radius: 5px;
    margin-left: 5px;
}
.x-messages-me {
    justify-content: flex-end;
}
.x-messages-me .messages-content {
    background: #2b99ff;
    color: #fff;
}

.x-chat {
    height: 100%;
    position: relative;
}
.x-chat-header {
    height: 50px;
    border-bottom: 1px solid #ddd;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.11);
    display: flex;
    align-items: center;
    padding: 0px 15px;
}
.x-chat-header .f-left,
.x-chat-header .f-right {
    flex: 1;
}
.x-chat-header .f-right {
    text-align: right;
}

.x-chat-content {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 150px;
    overflow-y: scroll;
}
.x-chat-content::-webkit-scrollbar
{
    width: 5px;
    height: 50px;
    background-color: #313130;
}

.x-chat-content::-webkit-scrollbar-track {
    background-color: #fff;
 }
  /*定义滑块*/
.x-chat-content::-webkit-scrollbar-thumb {
    border: 5px solid #ddd;
    border-radius: 6px;
    background-color: #f6f6f6;
}



.x-chat-footer {
    width: 100%;
    height: 150px;
    border-top: 1px solid #ddd;
    position: absolute;
    bottom: 0;
    left: 0;
}
.x-chat-footer .x-chat-ops span{
    margin: 5px;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.33);
}
.x-chat-footer .x-chat-send {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
}
.x-chat-footer .x-chat-send .send {
    width: 100%;
    height: 73%;
}
.x-chat-footer .x-chat-send .send textarea {
    resize: none;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding: 0 5px;
}
.chat-friends-list {
    width: 300px;
    min-width: 0;
    border-right: 1px solid #ddd;
    overflow: hidden;
    max-height: 800px;
    overflow-y: scroll;
}
.chat-friends-list::-webkit-scrollbar
{
    width: 0px;
    height: 150px;
    background-color: #313130;
}

.chat-friends-list::-webkit-scrollbar-track {
    background-color: #fff;
 }
  /*定义滑块*/
.chat-friends-list::-webkit-scrollbar-thumb {
    border: 5px solid #ddd;
    border-radius: 6px;
    background-color: #f6f6f6;
}

.chat-friends-list ul {
    margin: 0;
    padding: 0;
    width: 300px;
    max-width: 350px;
}
.chat-friends-list ul li {
    list-style: none;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
}
.chat-friends-list ul li.select {
    background-color: rgba(0, 0, 0, 0.11);
}
.chat-friends-list ul li:hover {
    background-color: rgba(0, 0, 0, 0.11);
    transition:background-color 0.4s linear;
}

.chat-friends-list ul li .userAvater {
    width: 45px;
    height: 45px;
    color: #2b99ff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
}
.chat-friends-list ul li .content {
    flex: 1;
}
.chat-friends-list ul li .content .info .username{
    font-weight: bold;
}
.chat-friends-list ul li .content .info .date {
    font-size: 12px;
    color: #666;
    float: right;
}
.chat-friends-list ul li .content .rp .rp-mesg {
    font-size: 12px;
    color: #666;
}
.chat-friends-list ul li .content .rp .badge {
    float: right;
}




</style>
