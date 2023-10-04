import React, {useEffect,useState} from 'react';

import { Text,TouchableOpacity, View, Button, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from './HomeScreenStyles'
import Ionicons from '@expo/vector-icons/Ionicons';
import { readUser } from '../../../backend/user-config/user-service';
import { getGroups } from '../../../backend/group-config/group-service';
import { DocumentData } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  GroupScreen: { groupId: string };
};

  // type HomeScreenProps = {
  // navigation: StackNavigationProp<RootStackParamList, 'Home'>;
// };



const HomeScreen = ({ }) => {
  const [userName, setUserName] = useState('');
  const [groups, setGroups] = useState<DocumentData[]>([]);
  const navigation = useNavigation();
  
  const onPressAdicionarGrupo = () => {
    // Lógica para adicionar novo grupo
    console.log('Novo grupo adicionado!');
    // Adicione sua lógica aqui, como abrir um modal ou navegar para outra tela
  };

  const navigateToGroup = (groupId: string) => {
    console.log('Navegar para o grupo: ', groupId);
    navigation.navigate('GroupScreen', { groupId });
  };

  
  const fetchUserDataAndGroups = async () => {
    try {
      const userId = '8wE0dMGbNDDKP6eXgz4m'; // The ID of the user
      const userData = await readUser(userId);
      if (userData && userData.name) {
        setUserName(userData.name);
      }
  
      // Fetch the list of groups
      const groupsData: DocumentData[] = await getGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching user data and groups:', error);
    }
  };
      
  // Função para obter e definir o nome do usuário
  const fetchUserName = async () => {
    try {
      const userId = '8wE0dMGbNDDKP6eXgz4m'; // O ID do usuário desejado
      const userData = await readUser(userId);

      if (userData && userData.name) {
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Quando o componente montar, carregue o nome do usuário
    fetchUserName();
    fetchUserDataAndGroups();
  }, []);


    return (
      <View style={styles.container}>
        
        <View style={styles.header}>
          <View style={styles.profileContent}>
            <Image 
              source={{uri: 'https://s2-valor.glbimg.com/LZyCSHR22BjRuB06S60vWzmKJqQ=/0x0:5408x3355/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_63b422c2caee4269b8b34177e8876b93/internal_photos/bs/2020/T/A/fuvfecS5Od2cxQlrQ5Pw/kym-mackinnon-aerego3rque-unsplash.jpg'}}
              style={styles.profileImage}
              />
            <Text style={styles.profileName}>{ userName }</Text>
          </View>
          <View style={styles.notificationContent}>
            <Ionicons name="notifications-outline" size={28} color="white"/>
          </View>
        </View>

        <View style={styles.searchContainer}>
          
        </View>

        <View style={styles. groupListTitleView}>
          <Text style={styles.groupsListTitle}>Grupos</Text>
        </View>
        <ScrollView style={styles.list}>
          {groups.map((group) => (
            <TouchableOpacity onPress={() => navigateToGroup(group.groupId)} >
              <View style={styles.listItem} key={group.groupId}>
                <View style={styles.groupImageContainer}>
                  <Ionicons name="people-outline" size={28} color="white"/>
                </View>
                <View style={styles.groupInfo}>
                  <Text style= {styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupDescription}>{group.debtDescription}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.addGroupButtonView}>
          <TouchableOpacity onPress={onPressAdicionarGrupo} style={styles.addGroupButton}>
            <Ionicons name="add-circle-outline" size={28} color="white" style={styles.addIcon}/>
            <Text style={styles.addText}>Adicionar novo grupo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};


export default HomeScreen;
