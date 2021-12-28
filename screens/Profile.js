import React, { useState, useEffect } from 'react'
import { 
   View, 
   Text,
   StyleSheet,
   ImageBackground,
   Dimensions,
   StatusBar,
   FlatList,
   ActivityIndicator,
   Linking
} from 'react-native';
import * as Contacts from 'expo-contacts';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { getColorByLetter } from '../utils/index';

export default function Profile({ navigation, route }) {

   const [contactInfo, setContactInfo] = useState(null);

   useEffect(() => {
      getContact(route.params.contactInfo.id);
   }, [route.params.contactInfo.id])

   function getContact(id) {
      Contacts.getContactByIdAsync(id)
         .then((data) => {
            console.log(data)
            setContactInfo(data)
         })
   }

   function makeCall(phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`)
   }

   function deleteContact(contact) {
      Contacts.removeContactAsync(contactInfo.id); 
      navigation.navigate('MyContacts')
   }

   
   if(!contactInfo) {
      return <ActivityIndicator size={32} />
   }

   return (
      <View style={styles.container}>
         <ImageBackground
            source={{ uri: contactInfo.hasThumbnail ? contactInfo.thumbNailpath : null }}
            style={{ ...styles.backgroundImage, backgroundColor: contactInfo.color }}
         >
            {
               !contactInfo.hasThumbnail 
               ? 
                  <FontAwesome5 name='user-alt' size={125} color='orange' />
               :
               null
            }
            <AntDesign
               onPress={() => deleteContact(contactInfo)} 
               name='delete' size={28} color='red'
               style={{ position: 'absolute', top: StatusBar.currentHeight, right: 20 }}
            />
            <Text style={styles.mainText}>{contactInfo.firstName}</Text>
         </ImageBackground>

         <View style={{ flex: 1, marginTop: 20 }}>
            <FlatList 
               data={contactInfo.phoneNumbers}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                  <View style={styles.phonenNumberContainer}>     
                     <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.number}</Text>
                     <MaterialIcons name='call' size={28} color='green'
                        onPress={() => makeCall(item.number)} />
                  </View>
               )}
            />
         </View>
      </View>
   )
}


const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   backgroundImage: {
     width: Dimensions.get('screen').width,
     height: Dimensions.get('screen').height/3,
     alignItems: 'center',
     justifyContent: 'center',
   },
   mainText:{
     position: 'absolute',
     bottom: 20,
     left: 20,
     fontSize: 30,
     color: 'black',
     fontWeight: 'bold'
   },
   phonenNumberContainer: {
     flex: 1,
     marginHorizontal: 10,
     marginBottom: 20,
     paddingHorizontal: 10,
     elevation: 5,
     paddingVertical: 20,
     backgroundColor: 'white',
     flexDirection: 'row',
     justifyContent: 'space-between'
   }
 })
