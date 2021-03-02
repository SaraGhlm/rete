import { Input } from './input';

export class Connection {

    output: Input;
    input: Input;
    data: unknown = {};

    constructor(output: Input, input: Input) {
        this.output = output;
        this.input = input;
        this.data = {};

        this.input.addConnection(this);
    }

    remove() {
        this.input.removeConnection(this);
        this.output.removeConnection(this);
    }
}