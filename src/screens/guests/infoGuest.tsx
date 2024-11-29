import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text, FlatList, Modal } from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore, { and } from '@react-native-firebase/firestore';
import ModalInfoGuest from './modalInfoGuest';

interface Guest {
  id: string;
  name: string;
  numAcompanhantes: number;
  confirmation: boolean;
}

interface Props {
  eventId: string;
  numGuestsEvent: (num: number) => void;
  screen: 'all' | 'confirmed';
}

export default function InfoGuest({ eventId, numGuestsEvent, screen }: Props) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [guestId, setGuestId] = useState<string>('');

  const fetchGuests = useCallback(() => {
    let query = firestore().collection('convidados').where('event', '==', eventId);
  
    if (screen === "confirmed") {
      query = query.where('confirmation', '==', true); // Filtra para os confirmados, se necessário
    }
  
    const unsubscribe = query.onSnapshot(snapshot => {
      const guestsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Guest[];
  
      setGuests(guestsList);
  
      // Calcula o total de convidados
      const totalGuests = guestsList.reduce((sum, guest) => sum + guest.numAcompanhantes, guestsList.length);
      numGuestsEvent(totalGuests);
    });
  
    // Retorna a função de desinscrição para parar de ouvir atualizações quando o componente desmontar
    return unsubscribe;
  }, [eventId, numGuestsEvent, screen]);
  
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = fetchGuests();
      return () => unsubscribe();
    }, [fetchGuests])
  );

  const renderEventItem = ({ item }: { item: Guest }) => (
    <Pressable className='mb-4 w-11/12 bg-white self-center p-2' style={styles.shadow} onPress={() => {
      setModalVisible(true)
      setGuestId(item.id)
    }}>
      {/* <View className='flex-row items-center justify-around p-3'>
        <Text className='font-bold text-lg'>{item.name}</Text>
        <Text className='color-slate-400'>
          {item.confirmation != undefined ?
            item.confirmation == true ? 'Presença confirmada' : 'Não poderá comparecer'
            : 'Esperando confirmação'}
        </Text>
      </View>
      <Text className='mx-7 mb-4'>{item.numAcompanhantes} acompanhantes</Text> */}
      <Text className='font-bold text-lg p-3'>{item.name}</Text>
      <View className='flex-row items-center justify-between p-3'>
        <Text>{item.numAcompanhantes} acompanhantes</Text>
        <Text className='color-slate-400'>
          {item.confirmation != undefined ?
            item.confirmation == true ? 'Presença confirmada' : 'Não poderá comparecer'
            : 'Esperando confirmação'}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View>
      <FlatList
        data={guests}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
      />

      {/* Modal ao clicar em convidado */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalInfoGuest
          handleClose={() => {
            setModalVisible(false);
            setGuestId(''); // Limpa o guestId quando o modal fecha
            fetchGuests(); // Atualiza a lista de convidados após fechar o modal
          }}
          guestId={guestId}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 4,
  }
});
