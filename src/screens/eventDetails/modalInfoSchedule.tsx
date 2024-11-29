import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable, Alert, TextInput, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import ModalAddProgram from './modalAddProgram';
import { Program } from './index';
import Linha from '@/src/components/linha';

interface Props {
  handleClose: () => void;
  eventId: string;
}

export default function ModalInfoSchedule({ handleClose, eventId }: Props) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProgramIndex, setEditingProgramIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Carregar as atividades do evento
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = firestore()
        .collection('eventos')
        .doc(eventId)
        .onSnapshot(docSnap => {
          if (docSnap.exists) {
            const eventData = docSnap.data();
            setPrograms(eventData?.programs || []);
          }
        });

      return () => unsubscribe();
    }, [eventId])
  );

  // Função para salvar as mudanças após edição
  const handleSavePrograms = async () => {
    try {
      await firestore().collection('eventos').doc(eventId).update({
        programs: programs
      });
      setIsEditing(false);
      setEditingProgramIndex(null);
      Alert.alert("Programação atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar a programação:", error);
      Alert.alert("Erro", "Não foi possível atualizar a programação.");
    }
  };

// Função para excluir um programa específico
const handleDeleteProgram = async (index: number) => {
  try {
    // Obter o documento atual do Firestore
    const eventDoc = await firestore().collection('eventos').doc(eventId).get();

    if (eventDoc.exists) {
      // Recuperar o array atual de programas
      const currentPrograms = eventDoc.data()?.programs || [];

      // Remover o programa do array atual
      const updatedPrograms = currentPrograms.filter((_: any, i: number) => i !== index);

      // Atualizar o banco de dados com o array atualizado
      await firestore().collection('eventos').doc(eventId).update({
        programs: updatedPrograms,
      });

      // Atualizar o estado local para refletir a exclusão
      setPrograms(updatedPrograms);
      console.log('Program removed successfully:', updatedPrograms);
    } else {
      console.error('Event document does not exist');
    }
  } catch (error) {
    console.error('Error removing program:', error);
  }
};

  // Renderiza cada atividade
  const renderPrograms = ({ item, index }: { item: Program, index: number }) => (
    <View style={styles.programContainer}>
      {isEditing && editingProgramIndex === index ? (
        <>
          <TextInput
            style={styles.input}
            value={item.description}
            onChangeText={text => handleEditProgram(index, 'description', text)}
            maxLength={30}
          />
          <TextInput
            style={styles.input}
            value={item.time}
            onChangeText={text => handleEditProgram(index, 'time', text)}
            keyboardType="numeric"
            maxLength={5}
          />
          <TextInput
            style={styles.input}
            value={item.location}
            onChangeText={text => handleEditProgram(index, 'location', text)}
            maxLength={45}
          />
          <View className='w-full flex-row justify-between'>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Text className='rounded-md my-5 color-black px-4 h-12 w-full text-center p-3 bg-slate-100' style={[styles.shadow]}>CANCELAR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSavePrograms()}>
              <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3 bg-black' style={[styles.shadow]}>SALVAR</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View className='flex-row justify-end'>
            <Pressable onPress={() => startEditingProgram(index)}>
              <MaterialIcons className='px-3' name="edit" size={24} color="black" />
            </Pressable>
            <Pressable onPress={() => handleDeleteProgram(index)}>
              <MaterialIcons name="delete" size={24} color="black" />
            </Pressable>
          </View>
          <View className="m-4 items-start">
            <View className="flex-row">
              <Text className="font-bold text-lg">{item.description}</Text>
              <Text className="text-lg"> - </Text>
              <Text className="text-lg">{item.time}h</Text>
            </View>
            <Text className="text-lg">{item.location}</Text>
          </View>
        </>
      )}
    </View>
  );

  // Inicia a edição de um programa específico
  const startEditingProgram = (index: number) => {
    setEditingProgramIndex(index);
    setIsEditing(true);
  };

  // Edita o campo específico do programa
  const handleEditProgram = (index: number, field: keyof Program, value: string) => {
    const updatedPrograms = [...programs];
    updatedPrograms[index] = { ...updatedPrograms[index], [field]: value };
    setPrograms(updatedPrograms);
  };

// Função para adicionar nova atividade
const handleAddProgram = async (newProgram: Program) => {
  try {
    await firestore().collection('eventos').doc(eventId).update({
      programs: firestore.FieldValue.arrayUnion(newProgram)
    });
    Alert.alert("Programação adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar o programa:", error);
    Alert.alert("Erro", "Não foi possível adicionar a programação.");
  }
};


  return (
    <View style={styles.container}>
      <View className="w-11/12" style={styles.scrollContent} >
        <View style={styles.modalContent}>
          <FlatList
            data={programs}
            keyExtractor={(item, index) => `${index}`}
            renderItem={renderPrograms}
          />
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Text style={styles.buttonText}>ADICIONAR MAIS</Text>
          </TouchableOpacity>
          {showAddModal && (
            <Modal
              visible={showAddModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowAddModal(false)}
            >
              <ModalAddProgram handleClose={() => setShowAddModal(false)} eventId={eventId} />
            </Modal>
          )}
          <TouchableOpacity onPress={handleClose}>
            <Text className='rounded-md my-5 color-black px-4 h-12 w-full text-center p-3 bg-slate-100'>FECHAR</Text>
          </TouchableOpacity>
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
    justifyContent: 'center'
  },
  programContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    flex: 1,
  },
  addButton: {
    backgroundColor: 'rgba(34, 150, 243, 1)',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1, // Faz o conteúdo ocupar toda a tela
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    paddingVertical: 20, // Espaço vertical ao redor do conteúdo
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  shadow:
    {
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Offset da sombra
        shadowOpacity: 0.15, // Opacidade da sombra
        shadowRadius: 3.5, // Raio da sombra
        elevation: 4, // Para Android
    },
});
