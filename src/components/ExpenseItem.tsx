import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ExpenseItem = ({date, groupName, amountPaid, description, datePaid}) => {
    const formattedDate = new Date(datePaid.seconds * 1000).toLocaleDateString();

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{date}</Text>
            </View>
            <Text style={styles.groupNameText}>{groupName}</Text>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.amountContainer}>
                <Text style={styles.amountPaidText}>
                    Você pagou: {amountPaid.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                </Text>
                <Text style={styles.dateText}>Data: {formattedDate}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#28C29F',
        borderWidth: 0.2,
        borderColor: '#FFFFFF',
        marginBottom: 16,
        marginHorizontal: 16,
        borderRadius: 8,
        padding: 16,
    },
    description: {
        color: '#FFFFFF',
        fontSize: 14,
        marginRight: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginRight: 8,
    },
    groupNameText: {
        color: '#FFFFFF',
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 8,
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    amountPaidText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    amountReceivedText: {
        color: '#F14B2D',
        fontSize: 14,
    },
});

export default ExpenseItem;
