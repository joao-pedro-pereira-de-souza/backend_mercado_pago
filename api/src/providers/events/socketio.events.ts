import {Server} from 'socket.io';

export default class SocketEvents {
    static events(io: Server) {
        io.on('details', () => {
            console.log('================================= events ==========================================');
        });
    }
}
