export interface User {
    email: string;
    groups: string[]; // An array of group IDs that the user belongs to
    name: string;
    pix: string;
    userId: string;
}