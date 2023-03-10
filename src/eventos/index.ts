export type Evento = {
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

export default class Eventos {
    public eventos: Evento[];

    constructor(eventos: Evento[]) {
        this.eventos = eventos;
    }

}

