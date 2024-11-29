import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CardGift from './cardGift';

export default function Gifts() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>Adicione presentes a sua lista para compartilhar com seus convidados!</Text>
<CardGift/>
      </ScrollView>
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
        // onPress={() => setModalVisible(true)}
        >
          <View className='flex-row items-center justify-center'>
            <Feather name='plus' size={20} color="#121212" />
            <Ionicons name='gift' size={35} color="#121212" />
          </View>

        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Adiciona espaço extra no final da tela para rolar
  },
});