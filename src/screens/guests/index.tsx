import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Pressable, View, Text, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import ModalAddGuest from './modalAddGuest';
import InfoGuest from './infoGuest';
import { RouteProp, useRoute } from '@react-navigation/native';

interface EventScreenProps {
  route?: { params: { eventId: string } }; // Define que o evento é da rota "Event" e espera um parâmetro "eventId"
}

interface Props {
  eventId: string;
}

type EventScreenRouteProp = RouteProp<{ params: { eventId: string } }, 'params'>;

// Crie o componente para a aba "Todos"
function AllGuests() {
  const route = useRoute<EventScreenRouteProp>();
  const eventId = route.params?.eventId || 'ID não encontrado';
  const [totalGuests, setTotalGuests] = useState(0);

  return (
    <View style={{ flex: 1 }}>
        <Text className='m-5'>Total de convidados: {totalGuests}</Text>
        <InfoGuest eventId={eventId} numGuestsEvent={setTotalGuests} screen='all'/>
    </View>
  );
}

// Crie o componente para a aba "Confirmados"
function ConfirmedGuests() {
  const route = useRoute<EventScreenRouteProp>();
  const eventId = route.params?.eventId || 'ID não encontrado';
  const [confirmedGuests, setConfirmedGuests] = useState(0);

  return (
    <View style={{ flex: 1 }}>
        <Text className='m-5'>Convidados confirmados: {confirmedGuests}</Text>
        <InfoGuest eventId={eventId} numGuestsEvent={setConfirmedGuests} screen='confirmed'/>
    </View>
  );
}

// Crie o Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

export function Guests({ route }: EventScreenProps) {
  const eventId = route?.params?.eventId || 'ID não encontrado';
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Navegação entre as abas */}
      <Tab.Navigator>
        <Tab.Screen
          name={`Todos`} // Exibe o número de convidados
          component={AllGuests}
          initialParams={{ eventId }} 
        />
        <Tab.Screen
          name={`Confirmados`} // Exibe o número de confirmados
          component={ConfirmedGuests}
          initialParams={{ eventId }}
        />
      </Tab.Navigator>

      {/* Botão flutuante para adicionar convidado */}
      <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <Pressable 
          className="w-20 h-20 bg-white rounded-full flex justify-center items-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3.5,
            elevation: 4,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name='person-add' size={35} color="#121212" />
        </Pressable>
      </View>

      {/* Modal para adicionar acompanhante */}
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalAddGuest
          handleClose={() => setModalVisible(false)}
          eventId={eventId}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Adiciona espaço extra no final da tela para rolar
  },
});
