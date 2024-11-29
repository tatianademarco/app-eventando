import { Banner } from "@/src/components/banner";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, Modal, Alert } from "react-native";
import MoreDetails from "./moreDetails";
import firebase from '@react-native-firebase/app';
import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { MainImage } from "./image";
import { Image } from "react-native-reanimated/lib/typescript/Animated";
import Button from "@/src/components/button";
import ModalAddProgram from "./modalAddProgram";
import Linha from "@/src/components/linha";
import Programs from "./programs";
import InfoShedule from "./modalInfoSchedule";
import { useFocusEffect } from "expo-router";

interface EventScreenProps {
  route?: { params: { eventId: string, eventName: string } }; // Define que o evento é da rota "Event" e espera um parâmetro "eventId"
}

interface Event {
  name: string;
  date: Timestamp;
  image?: string;
  programs?: Program[];
}
export interface Program {
  description: string;
  time: string;
  location: string;
}

export function EventCountdown({ eventDate }: { eventDate: Date }) {
  const [timeLeft, setTimeLeft] = useState('');

  // Função para calcular o tempo restante
  const calculateTimeLeft = () => {
    const now = new Date();
    now.setHours(now.getHours() - 3);
    
    const timeDifference = eventDate.getTime() - now.getTime(); // diferença em milissegundos

    if (timeDifference > 0) {
      const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / (1000)).toString().padStart(2, '0');

      setTimeLeft(`${daysLeft}  ${hoursLeft}:${minutesLeft}:${secondsLeft}`);
    } else {
      setTimeLeft('O evento já ocorreu.');
    }
  };

  useEffect(() => {
    calculateTimeLeft(); // Chamada inicial
    const timerId = setInterval(calculateTimeLeft, 1000); // Atualiza a cada segundo

    return () => clearInterval(timerId); // Limpa o intervalo quando o componente desmonta
  }, [eventDate]);

  return (
    <View>
      <Text className="text-lg ml-2 pt-1" style={{ fontFamily: 'Roboto-Medium', letterSpacing: 4, fontSize: 28 }}>{timeLeft}</Text>
    </View>
  );
}

export function EventDetails({ route }: EventScreenProps) {
  const eventId = route?.params?.eventId || 'ID não encontrado'; // Obtendo o ID do evento passado como parâmetro
  const [event, setEvent] = useState<Event | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [imageUri, setImageUri] = useState<string>('');
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = firestore()
        .collection('eventos')
        .doc(eventId)
        .onSnapshot(
          (docSnap) => {
            if (docSnap.exists) {
              const eventData = docSnap.data() as Event;
              setEvent(eventData);
              setPrograms(eventData.programs || []); // Carrega as programações existentes
              setImageUri(eventData.image || '');    // Carrega a imagem existente
            }
          },
          (error) => {
            console.error("Erro ao sincronizar o evento:", error);
            Alert.alert("Erro", "Não foi possível carregar as informações do evento.");
          }
        );
  
      return () => unsubscribe();
    }, [eventId])
  );

  const formatDate = (date: Timestamp) => {
    const jsDate = date.toDate();
    const day = jsDate.getDate().toString().padStart(2, '0');
    const month = (jsDate.getMonth() + 1).toString().padStart(2, '0'); // +1 pois getMonth() retorna de 0 a 11
    const year = jsDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // const handleAddProgram = (program: Program) => {
  //   if (program.description && program.time && program.location) {
  //     const updatedPrograms = [...programs, program];
  //     setPrograms(updatedPrograms);
  //     setEvent((prevEvent) => prevEvent ? { ...prevEvent, programs: updatedPrograms } : null);
  //     handleSaveEvent(updatedPrograms);
  //   }
  // };

  const handleSaveEvent = async (updatedPrograms: Program[] = programs) => {
    try {
      await firestore().collection('eventos').doc(eventId).update({
        programs: updatedPrograms,
        image: imageUri,
      });
      console.log(programs);
      console.log("Evento atualizado com sucesso!");
    } catch (e) {
      console.error("Erro ao atualizar evento: ", e);
    }
  };

  const handleImageChange = async (uri: string) => {
    try {
      await firestore().collection('eventos').doc(eventId).update({
        image: uri,
      });
      console.log("Evento atualizado com sucesso!");
    } catch (e) {
      console.error("Erro ao atualizar evento: ", e);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} className="bg-slate-200" showsVerticalScrollIndicator={false}>
      <View className="w-full">
        {/* <Banner /> */}
        {event ? (
          <>
            <MainImage uriImage={event.image} onImageChange={handleImageChange} />
            <View className="w-full flex items-center">
              <EventCountdown eventDate={event.date.toDate()} />
              <Text className="text-lg ml-2" style={{ fontFamily: 'Roboto-Medium', letterSpacing: 1 }}>dias     horas   min   seg</Text>
            </View>
            <View className='px-5 mt-6'>
              <Text className="text-3xl font-bold" style={{ fontFamily: 'Roboto-Medium' }}>{event.name}</Text>
              <Text className="text-xl">{formatDate(event.date)}</Text>
            </View>
            {event.programs?.length ? (
              <Programs programs={programs} action={() => setModalInfoVisible(true)} />
            ) : (
              <View className="mt-10 items-center self-center">
                <Button text="ADICIONAR PROGRAMAÇÃO" size="text-lg" width="w-96" height="h-16" marginTop="5" action={() => setModalAddVisible(true)} />
              </View>
            )}
          </>
        ) : (
          <Text>Carregando...</Text>
        )}
      </View>

      <Modal
        visible={modalAddVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalAddVisible(false)}
      >
        <ModalAddProgram handleClose={() => setModalAddVisible(false)} eventId={eventId}/>
      </Modal>

      <Modal
        visible={modalInfoVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalInfoVisible(false)}>
        <InfoShedule
          handleClose={() => setModalInfoVisible(false)}
          eventId={eventId}
        />
      </Modal>

      <View className="px-7 mt-5">
        <Text className="text-lg">Adicionar mais detalhes</Text>
        <MoreDetails />
      </View>

    </ScrollView>

  );
}
