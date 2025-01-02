import { ClientEvents } from 'discord.js';

export class Event<Key extends keyof ClientEvents> {
    public event: Key;
    public run: (...args: ClientEvents[Key]) => void;

    constructor(event: Key, run: (...args: ClientEvents[Key]) => void) {
        this.event = event;
        this.run = run;
    }
}
