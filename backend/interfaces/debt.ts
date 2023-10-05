export interface Debt {
    groupId: string; // ID of the group to which the debt belongs
    debtorId: string; // ID of the user who owes the debt
    amount: number; // Amount of the debt
    description: string; // Description of the debt
    isPaid: boolean; // Indicates whether the debt is paid
    datePaid?: Date; // Date when the debt was paid (optional)
    dateCreated: Date; // Date when the debt was created
}
