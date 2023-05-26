import {ShortcutDto} from "@/app/shortcut/ShortcutDto"

export async function createShortcut(shortcut: ShortcutDto): Promise<CreateShortcutResponse> {
    const response = await fetch('http://localhost:8080/shortcuts', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(shortcut),
    })

    if (response.ok) {
        return new CreateShortcutResponse((await response.json()).target, CreationOutcome.CREATED)
    } else {
        return new CreateShortcutResponse(response.status.toFixed(2), CreationOutcome.FAILURE)
    }
}

export class CreateShortcutResponse {
    target: string
    answer: CreationOutcome

    constructor(target: string, answer: CreationOutcome) {
        this.target = target
        this.answer = answer
    }
}

export enum CreationOutcome {
    CREATED,
    FAILURE
}
