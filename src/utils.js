import axios from "axios";

export const joinRoom = (token, roomId) => {
    console.log(`Connecting socket...`, token, roomId);
    if (token && roomId) {
        window.mySocket.emit('join', token, roomId)
    };
}

export const disconnectSocket = () => {
    console.log('Disconnecting socket...');
    if(window.mySocket) window.mySocket.disconnect();
}

export const subscribeToChat = (cb) => {
    if (!window.mySocket) return(true);  
    window.mySocket.on('chat', msg => {
      console.log('Websocket event received!');
      return cb(null, msg);
    });
}

export const sendMessage = (token, room, message) => {
    if (message) {
        window.mySocket.emit("sendMessage", {
            token: token,
            room_id: room,
            message: message
        });
    }
}

export const dataAxios=async (data)=>{

    let res=await axios({
        method: data.method,
        url: 'http://130.185.77.59:80/' + data.url,
        headers: {'access-token':window.localStorage.getItem('access-token')},
        data: data.data,
        params: data.params
    }).then(function (result) {
        console.log(result)
        if(result.data.status === 'OK') {
        return({
            situation: 'ok',
            result: result.data
        })
        }else{
        return({
            situation: 'error',
            result: result.data
        })
        }
    }).catch(function (error) {
        console.log(error)
        return({
        situation: 'error',
        result: (error.response)?error.response.data.message:error.message
        })
    });
    return (res)
}
