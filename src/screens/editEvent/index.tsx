import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

interface EditEventProps {
  route: {
    params: {
      eventId: string;
    };
  };
  navigation: {
    goBack: () => void;
  };
}

export default function EditEvent({ route, navigation }: EditEventProps) {
  const { eventId } = route.params;
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Carrega os dados do evento ao abrir a tela
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventDoc = await firestore().collection('eventos').doc(eventId).get();
        if (eventDoc.exists) {
          const eventData = eventDoc.data();
          setEventName(eventData?.name || '');
          const eventDate = eventData?.date?.toDate();
          if (eventDate) {
            setSelectedDate(eventDate);
            setSelectedTime(eventDate);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar o evento: ', error);
      }
    };
    fetchEventData();
  }, [eventId]);

  const handleSave = async () => {
    try {
      if (selectedDate && selectedTime) {
        const updatedDate = new Date(selectedDate);
        updatedDate.setHours(selectedTime.getHours());
        updatedDate.setMinutes(selectedTime.getMinutes());

        await firestore().collection('eventos').doc(eventId).update({
          name: eventName,
          date: firebase.firestore.Timestamp.fromDate(updatedDate),
        });
        console.log("Evento atualizado com sucesso");

        // Volta para a tela anterior após salvar
        navigation.goBack();
      } else {
        console.error("Data ou hora não selecionadas.");
      }
    } catch (e) {
      console.error("Erro ao atualizar o evento: ", e);
    }
  };

  const showDatePickerFunc = () => setShowDatePicker(true);
  const showTimePickerFunc = () => setShowTimePicker(true);

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) setSelectedTime(time);
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View className='flex items-center bg-white rounded-xl w-11/12 pt-8 pb-8'>
        <View className='w-11/12'>
          <Text className='text-center text-lg'>Editar Evento</Text>
          <TextInput
            className='rounded-md my-5 px-4 h-12 bg-slate-100 w-full text-lg'
            value={eventName}
            onChangeText={setEventName}
            placeholder='Nome do Evento'
          />

          <View className='flex-row justify-between'>
            {selectedDate && (
              <Text className='rounded-md my-5 px-4 h-12 bg-slate-100 w-1/2 p-3'>
                {formatDate(selectedDate)}
              </Text>
            )}
            <TouchableOpacity className='w-1/2' onPress={showDatePickerFunc}>
              <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3' style={[styles.button, styles.shadow]}>
                SELECIONAR DATA
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <View className='flex-row justify-between'>
            {selectedTime && (
              <Text className='rounded-md my-5 px-4 h-12 bg-slate-100 w-1/2 p-3'>
                {selectedTime.toLocaleTimeString()}
              </Text>
            )}
            <TouchableOpacity className='w-1/2' onPress={showTimePickerFunc}>
              <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3' style={[styles.button, styles.shadow]}>
                SELECIONAR HORA
              </Text>
            </TouchableOpacity>
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime || new Date()}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          <View className='w-full flex-row justify-between'>
            <TouchableOpacity onPress={navigation.goBack}>
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
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(34, 150, 243, 1)',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 4,
  },
});
