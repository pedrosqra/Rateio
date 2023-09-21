export class UserDTO {
    email;
    name;
    pix;

    constructor(data) {
        this.email = data.email;
        this.name = data.name;
        this.pix = data.pix;
    }

}