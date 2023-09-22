export interface Debt {
    groupId: string; // ID of the group to which the debt belongs
    debtorId: string; // ID of the user who owes the debt
    amount: number; // Amount of the debt
    description: string; // Description of the debt
}