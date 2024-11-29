import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Program } from './index';
import InfoShedule from './modalInfoSchedule';
import firestore from '@react-native-firebase/firestore';

interface ModalAddProps {
  handleClose: () => void;
  eventId: string;
}

export default function ModalAddProgram({ handleClose, eventId }: ModalAddProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');

  const handleTimeChange = (text: string) => {
    let formattedText = text.replace(/[^0-9]/g, '');
    if (formattedText.length > 4) {
      formattedText = formattedText.slice(0, 4);
    }
    if (formattedText.length >= 3) {
      formattedText = `${formattedText.slice(0, 2)}:${formattedText.slice(2)}`;
    }
    setTime(formattedText);
  };

  const handleSaveEvent = async (newProgram: Program) => {
    try {
      // Obter o documento atual do Firestore
      const eventDoc = await firestore().collection('eventos').doc(eventId).get();
  
      if (eventDoc.exists) {
        // Recuperar o array atual de programas
        const currentPrograms = eventDoc.data()?.programs || [];
  
        // Adicionar o novo programa ao array atual
        const updatedPrograms = [...currentPrograms, newProgram];
  
        // Atualizar o documento com o array atualizado
        await firestore().collection('eventos').doc(eventId).update({
          programs: updatedPrograms,
        });
  
        console.log('Program added to Firestore:', updatedPrograms);
  
        // Atualizar o estado local
        setPrograms(updatedPrograms);
      } else {
        console.error('Event document does not exist');
      }
    } catch (error) {
      console.error('Error adding program to Firestore:', error);
    }
  };
  
  const handleSave = () => {
    const program = { description, time, location: address };
    if (program.description && program.time && program.location) {
      handleSaveEvent(program);
  
      // Limpar os campos após salvar
      setDescription('');
      setTime('');
      setAddress('');
    }
  };
  

  return (
    <View style={styles.container}>
      <View className='flex items-center bg-white rounded-xl w-11/12 pt-8 pb-8'>
        <View className='w-11/12'>
          <Text className='text-center text-lg'>Adicionar programação do evento</Text>
          <TextInput
            className='rounded-md my-5 px-4 h-12 bg-slate-100 w-full text-lg'
            placeholder="Descrição"
            value={description}
            onChangeText={setDescription}
            maxLength={30}
          />
          <TextInput
            className='rounded-md my-5 px-4 h-12 bg-slate-100 w-full text-lg'
            placeholder="Horário"
            value={time}
            onChangeText={handleTimeChange}
            keyboardType="numeric"
            maxLength={5}
          />
          <TextInput
            className='rounded-md my-5 px-4 h-12 bg-slate-100 w-full text-lg'
            placeholder="Local"
            value={address}
            onChangeText={setAddress}
            maxLength={45}
          />

          <View className='w-full flex-row justify-between'>
            <TouchableOpacity onPress={handleClose}>
              <Text className='rounded-md my-5 color-black px-4 h-12 w-full text-center p-3 bg-slate-100' style={[styles.shadow]}>
                CANCELAR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3 bg-black' style={[styles.shadow]}>
                SALVAR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 24, 0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 4
  }
});
