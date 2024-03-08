export class LogHubError extends Error {
    constructor(message: string) {
        super(message);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, LogHubError.prototype);
        // Set the name of the custom error
        this.name = 'LogHubError';
    }
}