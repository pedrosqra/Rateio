export interface Group {
    groupId: string
    adminId: string
    adminPix: string
    debtAmount: number
    debtDescription: string
    debtFinalDate: Date
    debts: Map<string, string>;
    name: string
}