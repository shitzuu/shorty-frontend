export class ShortcutDto {
    source: string
    target: string

    constructor(source: string, target: string) {
        this.source = source
        this.target = target
    }
}
