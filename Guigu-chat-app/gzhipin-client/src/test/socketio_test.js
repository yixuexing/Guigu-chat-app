/*//引入客户端io
import io from 'socket.io-client';
//连接服务器，得到与服务器的连接对象
const socket = io('ws://localhost:4000');
//绑定'receiveMessage'的监听，来接收服务器发送的消息
socket.on('receiveMsg',function(data){
    console.log('浏览器端接收到消息',data);
});
//向服务器发送消息
socket.emit('sendMsg',{name:'Tom'});
console.log('浏览器向服务器发送消息：',{name:'Tom'});*/

