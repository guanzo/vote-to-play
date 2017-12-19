
var socket;
const e = require('@shared/socket-events')

import vote from './vote'
import game from './game'

export default {
    connect(url,data){
        socket = io(url,{ query: data })

        vote.setListeners()
        game.setListeners()

		socket.on('connect',()=>{
			socket.emit(e.CHANNELS_JOIN,data)
		})
		
        socket.on('error',console.error)
    },
    get(){
        return socket
    }
}
