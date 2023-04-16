import { Command } from './Command';

export class CommandManager {
    private readonly commands = new Map<string, Command>();

    add(command: Command): this {
        this.commands.set(command.key, command);
        return this;
    }

    delete(command: Command): this {
        this.commands.delete(command.key);
        return this;
    }

    get(key: string) {
        return this.commands.get(key);
    }

    getAll(): ReadonlyMap<string, Command> {
        return this.commands;
    }
}
