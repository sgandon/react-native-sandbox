import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { PatientSchema } from "../api/extract-patients+api";
import z from "zod";

export default function Ai() {

  const { object: extractedPatients, submit, isLoading: isExtracting, stop } = useObject({
    api: 'http://192.168.2.211:8082/api/extract-patients',
    schema: z.array(PatientSchema),
    onError: (error) => {
      console.error('=== useObject ERROR ===');
      console.error('useObject error:', error);
    },
    onFinish: (object) => {
      console.log('=== useObject FINISH ===');
      console.log('Final extracted object:', object);
    },
  });

  const handleSubmit = () => {
    submit("Extract patients from the data");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Patient Extraction</Text>
        <TouchableOpacity 
          style={[styles.button, isExtracting && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isExtracting}
        >
          <Text style={styles.buttonText}>
            {isExtracting ? 'Extracting...' : 'Extract Patients'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {extractedPatients && extractedPatients.length > 0 ? (
          extractedPatients.map((patient, index) => (
            <View key={index} style={styles.patientCard}>
              <Text style={styles.patientName}>
                {patient?.firstname ? `${patient.firstname} ${patient.lastname}` : patient?.lastname}
              </Text>
              <Text style={styles.patientInfo}>Gender: {patient?.male ? 'Male' : 'Female'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            {isExtracting ? 'Extracting patients...' : 'No patients extracted yet. Press the button to start.'}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  patientCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});
