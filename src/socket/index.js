/**
 * 建立实时通讯
 */
const ws = require('ws');

const handles = {
    'sign': require('./sign'),
    'private': require('./private')
}

class Socket {
    map = new Map();
    caches = new Map();
    socket = null;

    connect() {
        this.socket = new ws.Server({ port: 12345 });
        const { map, caches } = this;  
        this.socket.on('connection', function (ws, req) {
            ws.on('message', function (buffer) {
                try {
                    /**
                     * @const {Object} data
                     * @const {string} data.type
                     * @const {Object} data.message
                     */
                    const data = JSON.parse(buffer.toString());
                    handles[data.type] && handles[data.type](data, ws, req, { map, caches });
                } catch (error) {
                    console.warn(error);
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });
            
            ws.on('error', (error) => {
                console.log(`Error: ${error}`);
            });
        });
    }

    constructor() {
        this.connect();
    }
}

module.exports = Socket;

