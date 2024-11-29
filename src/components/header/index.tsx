import { Text, View, Pressable } from "react-native";
import {Ionicons, Feather, MaterialIcons} from '@expo/vector-icons';

export function Header() {
  return(
    <View className="w-full items-center justify-between flex flex-row">
        <Pressable className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
            <Ionicons name='menu' size={23} color="#121212"/>
        </Pressable>

        <View className="flex-row items-center justify-center gap-2">
            <Text className="text-2xl">Meus Eventos</Text>
            <MaterialIcons name="event" size={23}></MaterialIcons>
        </View>

        <Pressable className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
            <Feather name='bell' size={23} color="#121212"/>
        </Pressable>

    </View>
  );
}
