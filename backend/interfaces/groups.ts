export interface Group {
    groupId: string;
    adminId: string;
    adminPix: string;
    debtAmount: number; // Total debt amount for the group
    debtDescription: string;
    debtFinalDate: Date;
    name: string;
    members: string[]; // An array of user IDs who are members of the group
}