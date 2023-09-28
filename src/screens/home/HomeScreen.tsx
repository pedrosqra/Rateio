import React, {useEffect,useState} from 'react';

import { Text, View, Button, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from './HomeScreenStyles'
import Ionicons from '@expo/vector-icons/Ionicons';
import { readUser } from '../../../backend/user-config/user-service';
import { getGroups } from '../../../backend/group-config/group-service';
import { DocumentData } from 'firebase/firestore';


type RootStackParamList = {
  Home: undefined;
  GroupScreen: undefined;
};

  type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};



const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [groups, setGroups] = useState<DocumentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToGroup = () => {
      navigation.navigate('GroupScreen'); // Navegar para a tela Grupo
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
          <Ionicons name="search-outline" size={24} color="black"/>
          <TextInput 
            style={styles.searchInput}
            placeholder="Pesquisar"
            placeholderTextColor="#666"
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>

        <View style={styles. groupListTitleView}>
          <Text style={styles.groupsListTitle}>Grupos</Text>
        </View>
        <ScrollView style={styles.list}>
          {groups.map((group) => (
            <View style={styles.listItem} key={group.groupId}>
              <View style={styles.groupImageContainer}>
                <Ionicons name="people-outline" size={28} color="white"/>
              </View>
              <View style={styles.groupInfo}>
                <Text style= {styles.groupName}>{group.name}</Text>
                <Text style={styles.groupDescription}>{group.debtDescription}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View>  
        </View>
      </View>
    );
};


export default HomeScreen;
