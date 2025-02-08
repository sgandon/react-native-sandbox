import { Text, SafeAreaView, StyleSheet, View, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {faker, he } from '@faker-js/faker';
import EditableDeletableItem from './components/EditableDeletableItem';
import { useState } from 'react';
import React from 'react';
// or any files within the Snack

interface Patient {
  id: string;
  text: string;
}

const generatePatients = (numPatients: number): Patient[] => {
  const patients: Patient[] = [];
  for (let i = 0; i < numPatients; i++) {
    const id = faker.string.uuid();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const text = `${firstName} ${lastName}`;
    patients.push({ id, text });
  }
  return patients;
};

const initialPatients = generatePatients(200);

export default function App() {
  const [patients, setPatients] = useState(initialPatients);
  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <View style={styles.container}>
          <Text>
          Reproducing the issue :
          [Reanimated] Reading from `value` during component render. Please ensure that you do not access the `value` property or use `get` method of a shared value while React is rendering a component.
          </Text>
          <FlatList
            data={patients}
            renderItem={({ item }) => (
              <EditableDeletableItem item={item}/>
            )}
          />
        </View>    
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(221, 218, 218)',
    width: '100%',
  },
});


