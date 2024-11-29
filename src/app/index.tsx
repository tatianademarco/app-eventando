import React from 'react';
import { Text, View, ScrollView, Pressable, ActivityIndicator, TouchableOpacity, Platform, ActionSheetIOS, Alert } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../screens/home';
import { Guests } from '../screens/guests';
import { Budget } from '../screens/budget';
import EditEvent from '../screens/editEvent';
import { EventDetails } from '../screens/eventDetails';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import Gifts from "../screens/gifts";
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Event: { eventName: string, eventId: string }; // 'eventName' como uma propriedade obrigatória
  EditEvent: { eventId: string, eventName: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator();

type EventRouteProp = RouteProp<{ Event: { eventId: string, eventName: string } }, 'Event'>;


function EventTabs() {
  // Obtendo o eventId da navegação Stack
  const route = useRoute<EventRouteProp>();
  const { eventId, eventName } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Details"
        component={EventDetails}
        initialParams={{ eventId, eventName }}
        options={{
          tabBarLabel: "Evento",
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "calendar" : "calendar-outline"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Guests"
        component={Guests}
        initialParams={{ eventId, eventName }}
        options={{
          tabBarLabel: "Convidados",
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "people" : "people-outline"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Gifts"
        component={Gifts}
        initialParams={{ eventId, eventName }}
        options={{
          tabBarLabel: "Presentes",
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "gift" : "gift-outline"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Budget"
        component={Budget}
        initialParams={{ eventId, eventName }}
        options={{
          tabBarLabel: "Orçamento",
          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons
              size={size}
              color={color}
              name={focused ? "cash-sharp" : "cash-outline"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  type NavigationProp = StackNavigationProp<RootStackParamList, 'EditEvent'>;
  const navigation = useNavigation<NavigationProp>();

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Event"
        component={EventTabs}
        options={({ route }) => ({
          headerTitle: route.params?.eventName || "Detalhes do Evento",
          headerRight: () => (
            <TouchableOpacity onPress={() => {
              if (Platform.OS === 'ios') {
                ActionSheetIOS.showActionSheetWithOptions(
                  {
                    options: ["Cancelar", "Excluir Evento"],
                    destructiveButtonIndex: 1,
                    cancelButtonIndex: 0,
                  },
                  (buttonIndex) => {
                    if (buttonIndex === 1) {
                      // Função de exclusão do evento
                      Alert.alert("Evento excluído");
                      navigation.goBack();
                    }
                  }
                );
              } else {
                Alert.alert(
                  "Opções",
                  "",
                  [
                    { text: "Cancelar", style: "cancel" },
                    {
                      text: "Editar", style: "default",
                      onPress: () => {
                        navigation.navigate("EditEvent", { eventId: route.params?.eventId, eventName: route.params?.eventName });
                      },                      
                    },
                    {
                      text: "Excluir Evento",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          // Função de exclusão do evento
                          await firestore().collection('eventos').doc(route.params?.eventId).delete();

                          Alert.alert("Evento excluído com sucesso");
                          navigation.goBack();
                        } catch (error) {
                          console.error("Erro ao excluir evento:", error);
                          Alert.alert("Erro", "Não foi possível excluir o evento. Tente novamente.");
                        }
                      },
                    },
                  ]
                );
              }
            }}>
              <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEvent}
        options={{ headerTitle: "Editar Evento" }}
      />
    </Stack.Navigator>
  );
}
