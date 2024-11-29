import React, { useState } from "react"
import { Text, View, ScrollView, Pressable, Modal, ImageBackground, StyleSheet } from "react-native"
import { Feather } from '@expo/vector-icons'
import { Header } from "../../components/header"
import Constants from "expo-constants"
import { EventsInfo } from "./eventsInfo"
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from "@/src/components/button"
import ModalCreateEvent from "@/src/screens/home/modalCreateEvent"

const statusBarHeight = Constants.statusBarHeight;

interface HomeProps {
  navigation: NavigationProp<any>; // Usando o tipo NavigationProp
}

export function Home({ navigation }: HomeProps) {

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }} className="bg-slate-200">
      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 15 }}>
        <Header />

        <Button
          text="CRIAR"
          size="text-lg"
          width="w-36"
          height="h-14"
          marginTop="mt-14"
          action={() => setModalVisible(true)}
        />

        <EventsInfo navigation={(id, name) => navigation.navigate('Event', { eventId: id, eventName: name })} />


        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <ModalCreateEvent
            handleClose={() => setModalVisible(false)}
            navigation={id => {
              setModalVisible(false); // Fecha o modal
              navigation.navigate('Event', { eventId: id });
              console.log(id);
            }}
          />
        </Modal>

      </View>
    </View>
  );
}