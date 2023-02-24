

type Event = {
    "id": string,
    "artist": string,
    "titulo": string,
    "descricao": string,
    "data": string,
    "tipo": string,
    "link_imagem": string,
    "link_spotify": string,
    "link_soundcloud": string,
}

export default class Events {
    public events: Event[]; // Remover globalThis

    constructor(events: Event[]) {
        this.events = events;
    }

}

