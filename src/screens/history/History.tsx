import React, {useEffect, useState} from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';
import ExpenseItem from '../../components/ExpenseItem';
import {getGroupById, getPaidDebtsForUser} from '../../../backend/group-config/group-service';

const History = () => {
    const date = new Date();
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const dateInBrazilianPortuguese = date.toLocaleDateString('pt-BR', options);

    const [userDebts, setUserDebts] = useState([]);

    useEffect(() => {
        const userId = 'o8AH7ASpWwIbZn9EKcAw';

        getPaidDebtsForUser(userId)
            .then(async debts => {
                const debtsWithGroupNames = await Promise.all(
                    debts.map(async debt => {
                        const group = await getGroupById(debt.groupId);
                        return {
                            ...debt,
                            groupName: group ? group.name : 'Unknown Group',
                        };
                    })
                );

                const groupedDebts = groupDebtsByGroupName(debtsWithGroupNames);

                setUserDebts(groupedDebts);
            })
            .catch(error => {
                console.error('Error fetching user debts:', error);
            });
    }, []);

    const groupDebtsByGroupName = debts => {
        const groupedDebts = {};

        debts.forEach(debt => {
            if (!groupedDebts[debt.groupName]) {
                groupedDebts[debt.groupName] = [];
            }

            groupedDebts[debt.groupName].push(debt);
        });

        return Object.keys(groupedDebts).map(groupName => ({
            title: groupName,
            data: groupedDebts[groupName],
        }));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Histórico de Despesas</Text>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{dateInBrazilianPortuguese}</Text>
            </View>
            <SectionList
                sections={userDebts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <ExpenseItem
                        groupName={item.groupName}
                        description={item.description}
                        amountPaid={item.amount}
                        datePaid={item.datePaid}
                    />
                )}
            />
        </View>
    );
};

// ... Rest of your styles and export statement


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#373B3F',
        paddingTop: 16,
    },
    titleText: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 80,
        margin: 50,
        textAlign: 'center',
    },
    dateText: {
        color: '#373B3F',
        fontWeight: "bold",
        fontSize: 18,
        margin: 8,
    },
    dateContainer: {
        backgroundColor: "#B9E6D8",
        marginTop: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        backgroundColor: '#EAEAEA',
        fontWeight: 'bold',
        padding: 8,
    },
});

export default History;
