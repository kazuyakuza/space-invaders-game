export class InputHandler {
    private keys: Set<string> = new Set();

    constructor() {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys.add(e.code);
            e.preventDefault();
        });

        document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys.delete(e.code);
        });
    }

    public isPressed(key: string): boolean {
        return this.keys.has(key);
    }
}