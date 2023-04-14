import { Command } from './Command';
import { CommandManager } from './CommandManager';
import { KeyPatternRecognizer } from './KeyPatternRecognizer';

export class KeyboardShortcutCommandManager {
    constructor(
        private readonly commandManager: CommandManager,
        private readonly keyPatternRecognizer: KeyPatternRecognizer
    ) {}

    set(keys: string[], command: Command): this {
        this.commandManager.add(command);
        this.keyPatternRecognizer.addListener(keys, command.run);
        return this;
    }

    delete(keys: string[], command: Command): this {
        this.commandManager.delete(command);
        this.keyPatternRecognizer.removeListener(keys, command.run);
        return this;
    }

    get(key: string) {
        return this.commandManager.get(key);
    }

    getAll(): ReadonlyMap<string, Command> {
        return this.commandManager.getAll();
    }
}
