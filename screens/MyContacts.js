import React, { useState, useEffect } from 'react'
import { 
   View,
   Text,
   FlatList,
   StyleSheet,
   TouchableOpacity,
   Touchable
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Contacts from 'expo-contacts';

import ContactCard from '../components/ContactCard';

export default function MyContacts({ navigation }) {

   useEffect(() => {
     const unsubscribe = navigation.addListener('focus', () => {
      (async () => {
         const { status } = await Contacts.requestPermissionsAsync();
         if (status === 'granted') {
           const { data } = await Contacts.getContactsAsync({
             fields: [Contacts.Fields.Emails],
           });
   
           if (data.length > 0) {
              setMyContacts(data);
           }
         }
       })();
     });
   }, [navigation]);

   const [myContacts, setMyContacts] = useState([]);

   useEffect(() => {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails],
          });
  
          if (data.length > 0) {
               setMyContacts(data);
          }
        }
      })();
    }, []);

   return (
      <View style={styles.container}>
         <Ionicons 
            name='add-circle'
            size={62}
            color='green'
            style={styles.addIcon}
            onPress={() => navigation.navigate('CreateContact')}
         />
         <FlatList 
            data={myContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <TouchableOpacity onPress={() => navigation.navigate('Profile', {
                  contactInfo: { id: item.id }
               })}>
                  <ContactCard contactInfo={item} />
               </TouchableOpacity>
            )}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1, 
      backgroundColor: 'white'
    },
    addIcon: {
      bottom: 20,
      right: 20,
      position: 'absolute',
      zIndex: 1,
    }
})