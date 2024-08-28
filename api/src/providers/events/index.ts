import JobsEvents from './jobs.events';
import SocketEvents from './socketio.events';

import { Server } from 'socket.io';
export default class Events {
    constructor(private readonly io: Server) {}

    start() {
        JobsEvents.events(this.io);
        SocketEvents.events(this.io);
    }
}
