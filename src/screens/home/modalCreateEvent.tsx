import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

interface ModalCreateEventProps {
  handleClose: () => void;
  navigation: (id: string) => void;
}

export default function ModalCreateEvent({ handleClose, navigation }: ModalCreateEventProps) {
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Estado para armazenar a data selecionada
  const [selectedTime, setSelectedTime] = useState<Date | null>(null); // Estado para armazenar a hora selecionada
  const [showDatePicker, setShowDatePicker] = useState(false); // Estado para exibir o DateTimePicker para data
  const [showTimePicker, setShowTimePicker] = useState(false); // Estado para exibir o DateTimePicker para hora

  const handleSave = async () => {
    try {
      if (selectedDate && selectedTime) {
        const eventDate = new Date(selectedDate);
        const eventTime = new Date(selectedTime);

      // Combina a data e a hora
      eventDate.setHours(eventTime.getHours());
      eventDate.setMinutes(eventTime.getMinutes());

      const docRef = await firestore().collection('eventos').add({
        name: eventName,
        date: firebase.firestore.Timestamp.fromDate(eventDate),
      });
      console.log("Documento escrito com ID: ", docRef.id);

      // Navegar para a tela do evento após salvar
      navigation(docRef.id);
    } else {
      console.error("Data ou hora não selecionadas.");
    }
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  // Função para abrir o seletor de datas
  const showDatePickerFunc = () => {
    setShowDatePicker(true);
  };

  // Função para abrir o seletor de horas
  const showTimePickerFunc = () => {
    setShowTimePicker(true);
  };

  // Função para lidar com a mudança da data
  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false); // Fechar o DateTimePicker após a seleção
    if (date) {
      setSelectedDate(date); // Atualizar a data selecionada
    }
  };

  // Função para lidar com a mudança da hora
  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false); // Fechar o DateTimePicker após a seleção
    if (time) {
      setSelectedTime(time); // Atualizar a hora selecionada
    }
  };

  const formatDate = (selectedDate: Date) => {
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // +1 pois getMonth() retorna de 0 a 11
    const year = selectedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View className='flex items-center bg-white rounded-xl w-11/12 pt-8 pb-8'>
        <View className='w-11/12'>
          <Text className='text-center text-lg'>Criar Evento</Text>
          <TextInput className='rounded-md my-5 px-4 h-12 bg-slate-100 w-full text-lg'
            value={eventName}
            onChangeText={setEventName}
            placeholder='Nome do Evento'
          />

          <View className='flex-row justify-between'>
            {/* Mostrar a data selecionada */}
            {selectedDate && (
              <Text className='rounded-md my-5 px-4 h-12 bg-slate-100 w-1/2 p-3'>{formatDate(selectedDate)}</Text>
            )}

            {/* Botão para abrir o seletor de datas */}
            <TouchableOpacity className='w-1/2' onPress={showDatePickerFunc}>
              <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3' style={[styles.button, styles.shadow]}>SELECIONAR DATA</Text>
            </TouchableOpacity>
          </View>

          {/* Modal de seleção de data */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()} // Valor atual ou data padrão
              mode="date" // Modo para selecionar a data
              display="default" // Estilo do seletor
              onChange={onDateChange} // Função chamada ao selecionar a data
            />
          )}

          <View className='flex-row justify-between'>
            {/* Mostrar a hora selecionada */}
            {selectedTime && (
              <Text className='rounded-md my-5 px-4 h-12 bg-slate-100 w-1/2 p-3'>{selectedTime.toLocaleTimeString()}</Text>
            )}

            {/* Botão para abrir o seletor de horas */}
            <TouchableOpacity className='w-1/2' onPress={showTimePickerFunc}>
              <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3' style={[styles.button, styles.shadow]}>SELECIONAR HORA</Text>
            </TouchableOpacity>
          </View>

          {/* Modal de seleção de hora */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime || new Date()} // Valor atual ou hora padrão
              mode="time" // Modo para selecionar a hora
              display="default" // Estilo do seletor
              onChange={onTimeChange} // Função chamada ao selecionar a hora
            />
          )}

          <View className='w-full flex-row justify-between'>
            <TouchableOpacity onPress={handleClose}>
              <Text className='rounded-md my-5 color-black px-4 h-12 w-full text-center p-3 bg-slate-100' style={[styles.shadow]}>CANCELAR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3 bg-black' style={[styles.shadow]}>SALVAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Preenche toda a tela
    backgroundColor: 'rgba(24, 24, 24, 0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: 'rgba(34, 150, 243, 1)',
  },
  shadow:
  {
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Offset da sombra
    shadowOpacity: 0.15, // Opacidade da sombra
    shadowRadius: 3.5, // Raio da sombra
    elevation: 4, // Para Android
  }
});
