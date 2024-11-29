import { ScrollView, View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, TextInput } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useCallback, useState } from 'react';
import Suppliers from './suppliers';
import Linha from '@/src/components/linha';
import { MaterialIcons } from '@expo/vector-icons';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';

interface EventScreenProps {
  route?: { params: { eventId: string } }; // Define que o evento é da rota "Event" e espera um parâmetro "eventId"
}

interface Event {
  budget: number;
  totalExpenses: number;
  fixedExpenses: number;
  expensesPerGuest: number;
}

type EventScreenRouteProp = RouteProp<{ params: { eventId: string } }, 'params'>;


// Crie o componente para a aba "Meu orçamento"
function MyBudget() {
  const route = useRoute<EventScreenRouteProp>();
  const eventId = route.params?.eventId || 'ID não encontrado';
  const [modalBudgetVisible, setModalBudgetVisible] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState<number>();
  const [budget, setBudget] = useState<number>() || null;
  const [budgetformatted, setBudgetformatted] = useState('');
  const [originalBudget, setOriginalBudget] = useState<number>();
  const [fixedExpenses, setFixedExpenses] = useState<number>();
  const [expensesPerGuest, setExpensesPerGuest] = useState<number>();
  console.log(eventId);
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = firestore()
        .collection('eventos')
        .doc(eventId)
        .onSnapshot(docSnap => {
          if (docSnap.exists) {
            const guestData = docSnap.data() as Event;
            handleValueChange(guestData.budget || 0);
            setOriginalBudget(guestData.budget || 0);
            setBudget(guestData.budget);
            setTotalExpenses(guestData.totalExpenses);
            setFixedExpenses(guestData.fixedExpenses);
            setExpensesPerGuest(guestData.expensesPerGuest);
          } else {
            console.log("Nenhum documento encontrado!");
          }
        });

      // Cleanup listener on focus out
      return () => unsubscribe();
    }, [eventId])
  );

  const handleSaveEvent = async () => {
    try {
      await firestore().collection('eventos').doc(eventId).update({
        budget: budget,
      });
      console.log('Budget added to Firestore:', budget);
      setModalBudgetVisible(false);
    } catch (error) {
      console.error('Error adding budget to Firestore:', error);
    }
  };

  const handleCancel = () => {
    if (originalBudget !== undefined) {
      handleValueChange(originalBudget); // Restaura o valor formatado
      setBudget(originalBudget); // Restaura o valor numérico
    }
    setModalBudgetVisible(false); // Fecha o modal
  };
  

  // Função para formatar o valor como moeda (R$ 0,00)
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

const handleValueChange = (value: string | number) => {
    const numericValue = typeof value === 'string' 
        ? parseFloat(value.replace(/\D/g, '')) / 100 
        : value;

    setBudget(numericValue);
    setBudgetformatted(formatCurrency(numericValue));
};


  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Pressable className='mb-4 w-full p-1 bg-white self-center' style={styles.shadow} onPress={() => {
          setModalBudgetVisible(true)
        }}>
          <View className='flex items-center justify-around py-2'>
            <Text className='font-bold text-lg m-3'>MEU ORÇAMENTO</Text>
            <Linha />
            <View className='flex-row items-start justify-center mt-3'>
              <Text className='text-lg px-2'>{budgetformatted}</Text>
              <MaterialIcons name="edit" size={20} color="black" />
            </View>
          </View>
        </Pressable>

        <Pressable className='mb-4 w-full p-1 bg-white self-center' style={styles.shadow}>
          <View className='flex items-center justify-around py-2'>
            <Text className='font-bold text-lg'>GASTOS</Text>
            <Text className='text-lg pb-2'>0,00</Text>
            <Linha />
            <View className='w-full flex-row justify-around items-center'>
              <View className='items-center w-2/5'>
                <Text className='text-lg color-gray-950'>Fixos</Text>
                <Text className='text-lg'>0,00</Text>
              </View>
              <View
                style={{
                  height: 70,
                  borderRightColor: 'grey', // Cor da linha
                  borderRightWidth: 0.5,      // Espessura da linha
                  opacity: 0.5
                }}
              />
              <View className='items-center w-2/5'>
                <Text className='text-lg color-gray-950'>Por pessoa</Text>
                <Text className='text-lg'>0,00</Text>
              </View>
            </View>
          </View>
        </Pressable>

        <Pressable className='mb-4 w-full p-1 bg-white self-center' style={styles.shadow} onPress={() => {
        }}>
          <View className='flex items-center justify-around py-2'>
            <Text className='font-bold text-lg m-3'>SALDO ATUAL</Text>
            <Linha />
            <Text className='text-lg px-2 mt-3'>0,00</Text>
          </View>
        </Pressable>

        <Modal
          visible={modalBudgetVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalBudgetVisible(false)}>
          <View style={styles.container}>
            <View className="w-11/12" style={styles.scrollContent} >
              <View style={styles.modalContent}>
                <Text className='text-lg'>Defina o valor do seu orçamento:</Text>
                <TextInput
                  className='text-xl'
                  style={styles.input}
                  value={budgetformatted}
                  onChangeText={handleValueChange}
                  maxLength={24}
                />
                <View className='w-full flex-row justify-between'>
                  <TouchableOpacity onPress={handleCancel}>
                    <Text className='rounded-md my-5 color-black px-4 h-12 w-full text-center p-3 bg-slate-100' style={[styles.shadow]}>CANCELAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async () => {
                    await handleSaveEvent();
                    console.log(budget);
                  }}>
                    <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3 bg-black' style={[styles.shadow]}>SALVAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </View>
  );
}

// Crie o Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

export function Budget({ route }: EventScreenProps) {
  const eventId = route?.params?.eventId || 'ID não encontrado';
  return (
    <View style={{ flex: 1 }}>
      {/* Navegação entre as abas */}
      <Tab.Navigator>
        <Tab.Screen
          name={`Meu Orçamento`} // Exibe o número de convidados
          component={MyBudget}
          initialParams={{ eventId }}
        />
        <Tab.Screen
          name={`Fornecedores`} // Exibe o número de confirmados
          component={Suppliers}
          initialParams={{ eventId }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 100, // Adiciona espaço extra no final da tela para rolar
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 4,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  scrollContent: {
    flexGrow: 1, // Faz o conteúdo ocupar toda a tela
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    paddingVertical: 20, // Espaço vertical ao redor do conteúdo
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 24, 0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    marginTop: 10,
  },
});