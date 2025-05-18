import {io} from 'socket.io-client';

const socket = io('http://localhost:3334')

export default socket;