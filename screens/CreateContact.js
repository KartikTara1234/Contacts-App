import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import MyContacts from './MyContacts';

export default function CreateContact({ navigation }) {

   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [phoneNumbers, setPhoneNumbers] = useState(['']);

   useEffect(() => {
      if(phoneNumbers[phoneNumbers.length-1].length > 0) {
         setPhoneNumbers((prevState) => [...prevState, '']);
      }
      try {
         if((phoneNumbers[phoneNumbers.length-2].length === 0) && (phoneNumbers.length >= 2)) {
            setPhoneNumbers((prevState) => {
               const newState = prevState.slice();
               newState.pop()
               return newState;
            })
         } 
      } catch {}
   }, [phoneNumbers])


   function createContact() {
      if((!firstName && !lastName) || phoneNumbers.length === 1) {
         Alert.alert('Something went wrong', 'Please fill the all fields');
         return;
      }
      const myPhonenumbers = phoneNumbers.map((ph) => {
         return { label: 'mobile', number: ph };
      });

      const contactInfo = {
         [Contacts.Fields.FirstName]: firstName,
         [Contacts.Fields.LastName]: lastName,
      }
      const data = Contacts.addContactAsync(contactInfo);
      navigation.navigate('MyContacts');
   }

   return (
      <View style={styles.container}>
         <View style={styles.inputContainer}>
            <TextInput 
               style={styles.input}
               placeholder='FirstName'
               value={firstName}
               onChangeText={(text) => setFirstName(text)}
            />
            <TextInput 
               style={styles.input}
               placeholder='LastName'
               value={lastName}
               onChangeText={(text) => setLastName(text)}
            />
         </View>
         {phoneNumbers.map((phoneNumber, index) => (
            <View style={{ ...styles.inputContainer, marginVertical: 0}} key={index}>
               <TextInput 
               style={styles.input}
               placeholder='Phone Number'
               keyboardType='number-pad'
               value={phoneNumber}
               onChangeText={(text) => setPhoneNumbers((prevState) => {
                  const newState = prevState.slice();
                  newState[index] = text;
                  return newState;
               })}
            />
            </View>
         ))}
         <Button 
            title='Save'
            onPress={() => createContact()}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white'
    },
    inputContainer: {
      padding: 10,
      margin: 10
    },
    input: {
      borderBottomWidth: 0.5,
      borderBottomColor: 'gray',
      padding: 10
    }
})
