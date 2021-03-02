import { Connection } from './connection';
import { Control } from './control';
import { IO } from './io';
import { InputData } from './core/data';
import { Socket } from './socket';

export class Input extends IO {
   
    control: Control | null = null;

    constructor(key: string, title: string, socket: Socket, multiConns: boolean = false) {
        super(key, title, socket, multiConns);
    }

    hasConnection() {
        return this.connections.length > 0;
    }

    addConnection(connection: Connection) {
        if (!this.multipleConnections && this.hasConnection())
            throw new Error('Multiple connections not allowed');
        this.connections.push(connection);
    }

    addControl(control: Control) {
        this.control = control;
        control.parent = this;
    }

    showControl() {
        return !this.hasConnection() && this.control !== null;
    }

    toJSON(): InputData {
        return {
            'connections': this.connections.map(c => {
                if (!c.output.node) throw new Error('Node not added to Output');

                return {
                    node: c.output.node.id,
                    output: c.output.key,
                    data: c.data
                };
            })
        };
    }

    connectTo(input: Input) {
        if (!this.socket.compatibleWith(input.socket))
            throw new Error('Sockets not compatible');
        if (!input.multipleConnections && input.hasConnection())
            throw new Error('Input already has one connection');
        if (!this.multipleConnections && this.hasConnection())
            throw new Error('Output already has one connection');

        const connection = new Connection(this, input);

        this.connections.push(connection);
        return connection;
    }

    connectedTo(input: Input) {
        return this.connections.some((item) => {
            return item.input === input;
        });
    }
}