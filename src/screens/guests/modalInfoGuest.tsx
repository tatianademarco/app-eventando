import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Pressable, Alert, Switch } from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

interface Props {
    handleClose: () => void;
    guestId: string;
}

interface Guest {
    id: string;
    name: string;
    phone: string;
    email: string;
    numAcompanhantes: number;
    confirmation?: boolean;
    companion?: Acompanhante[];
}

interface Acompanhante {
    name: string;
    isChild: boolean;
    confirmation?: boolean;
}

export default function ModalInfoGuest({ handleClose, guestId }: Props) {
    const [guest, setGuest] = useState<Guest | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [acompanhantes, setAcompanhantes] = useState<Acompanhante[]>([]);
    const [confirmation, setConfirmation] = useState(false);
    const [numAcompanhantes, setNumAcompanhantes] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = firestore()
                .collection('convidados')
                .doc(guestId)
                .onSnapshot(docSnap => {
                    if (docSnap.exists) {
                        const guestData = docSnap.data() as Guest;
                        setGuest(guestData);
                        setName(guestData.name);
                        setPhone(guestData.phone);
                        setEmail(guestData.email);
                        setAcompanhantes(guestData.companion || []);
                        setConfirmation(guestData.confirmation || false);
                    } else {
                        console.log("Nenhum documento encontrado!");
                    }
                });

            // Cleanup listener on focus out
            return () => unsubscribe();
        }, [guestId])
    );

    const renderCompanions = ({ item, index }: { item: Acompanhante, index: number }) => (
        <View className='flex-row p-3'>
            {isEditing ? (
                <>
                    <TextInput className='text-lg w-8/12'
                        style={styles.input}
                        value={acompanhantes[index].name}
                        onChangeText={(value) => atualizarNome(index, value)}
                        placeholder={item.name}
                    />
                    <View className='flex-row justify-center items-center'>
                        <Text>{item.isChild ? 'Criança' : 'Adulto'}</Text>
                        <Switch
                            value={acompanhantes[index].isChild}
                            onValueChange={(value) => atualizarCrianca(index, value)} // Atualiza se é criança
                        />
                    </View>
                </>
            ) : (
                <View className='flex-row items-center'>
                    <Text className='text-lg'>{item.name}</Text>
                    {item.isChild && <Text className='color-slate-400 px-3'>Criança</Text>}
                </View>
            )
            }
        </View>
    );

      // Função para adicionar um novo acompanhante
  const adicionarAcompanhante = () => {
    setAcompanhantes([...acompanhantes, { name: '', isChild: false }]);
  };

    // Função para atualizar o nome do acompanhante
    const atualizarNome = (index: number, nome: string) => {
        const novosAcompanhantes = [...acompanhantes];
        novosAcompanhantes[index].name = nome;
        setAcompanhantes(novosAcompanhantes);
    };

    // Função para atualizar o status de "Criança ou Não"
    const atualizarCrianca = (index: number, isCrianca: boolean) => {
        const novosAcompanhantes = [...acompanhantes];
        novosAcompanhantes[index].isChild = isCrianca;
        setAcompanhantes(novosAcompanhantes);
    };

    const handleDeleteGuest = async () => {
        try {
            // Função de exclusão do convidado
            await firestore().collection('convidados').doc(guestId).delete();

            Alert.alert("Convidado excluído com sucesso");
            handleClose();
        } catch (error) {
            console.error("Erro ao excluir convidado:", error);
            Alert.alert("Erro", "Não foi possível excluir o convidado. Tente novamente.");
        }
    };

    const handlePresenceChange = async (presence: boolean) => {
        try {
            await firestore().collection('convidados').doc(guestId).update({
                confirmation: presence,
            });
            console.log("Convidado atualizado com sucesso!");

        } catch (e) {
            console.error("Erro ao atualizar convidado: ", e);
        }
    };

    const handleSave = async () => {
        try {
            const acompanhantesFiltrados = acompanhantes.filter(acompanhante => acompanhante.name.trim() !== '');

            const numAcompanhantes = acompanhantesFiltrados.length;
            await firestore().collection('convidados').doc(guestId).update({
                name: name,
                phone: phone,
                email: email,
                numAcompanhantes: numAcompanhantes,
                companion: acompanhantesFiltrados
            });
            console.log("Convidado atualizado com sucesso!");
            setIsEditing(false);
        } catch (e) {
            console.error("Erro ao atualizar convidado: ", e);
        }
    }

    return (
        <View
            style={styles.container}
        >
            <View style={styles.scrollContent} >
                <View style={styles.modalContent}>
                    {guest ?
                        isEditing ?
                            (
                                <>
                                    <View>
                                        <View>
                                            <TextInput className='text-xl color-slate-600'
                                                style={styles.input}
                                                value={name}
                                                onChangeText={setName}
                                                placeholder={guest.name}
                                            />
                                            <TextInput className='text-lg color-slate-600'
                                                style={styles.input}
                                                value={phone}
                                                onChangeText={setPhone}
                                                placeholder={guest.phone}
                                            />
                                            <TextInput className='text-lg color-slate-600'
                                                style={styles.input}
                                                value={email}
                                                onChangeText={setEmail}
                                                placeholder={guest.email}
                                            />
                                        </View>
                                        <View className='flex-row justify-between py-6'>
                                            <Text className='text-xl'>Confirme a Presença:</Text>
                                            {guest.confirmation != undefined ? guest.confirmation == true ?
                                                <View className='flex-row'>
                                                    <Pressable>
                                                        <AntDesign className='px-10' name="checkcircle" size={24} color="green" />
                                                    </Pressable>
                                                    <Pressable onPress={() => { handlePresenceChange(false) }}>
                                                        <AntDesign name="closecircleo" size={24} color="grey" />
                                                    </Pressable>
                                                </View>
                                                :
                                                <View className='flex-row'>
                                                    <Pressable onPress={() => { handlePresenceChange(true) }}>
                                                        <AntDesign className='px-10' name="checkcircleo" size={24} color="grey" />
                                                    </Pressable>
                                                    <Pressable>
                                                        <AntDesign name="closecircle" size={24} color="red" />
                                                    </Pressable>
                                                </View>
                                                :
                                                <View className='flex-row'>
                                                    <Pressable onPress={() => { handlePresenceChange(true) }}>
                                                        <AntDesign className='px-10' name="checkcircleo" size={24} color="black" />
                                                    </Pressable>
                                                    <Pressable onPress={() => { handlePresenceChange(false) }}>
                                                        <AntDesign name="closecircleo" size={24} color="black" />
                                                    </Pressable>
                                                </View>
                                            }
                                        </View>
                                        {Array.isArray(acompanhantes) && acompanhantes.length > 0 && (
                                            <>
                                                <Text>Acompanhantes:</Text>
                                                <FlatList
                                                    data={acompanhantes}
                                                    keyExtractor={(item, index) => `${index}`}
                                                    renderItem={renderCompanions}
                                                />
                                            </>
                                        )}
                                        <View>
                                        </View>

                                    </View>

                                    <TouchableOpacity style={styles.addButton} onPress={adicionarAcompanhante}>
                                        <Text style={styles.buttonText}>ADICIONAR ACOMPANHANTE</Text>
                                    </TouchableOpacity>

                                    <View className='w-full flex-row justify-between'>
                                        <TouchableOpacity onPress={() => setIsEditing(false)}>
                                            <Text className='rounded-md my-5 color-black px-4 h-12 w-full text-center p-3 bg-slate-100' style={[styles.shadow]}>CANCELAR</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={handleSave}>
                                            <Text className='rounded-md my-5 color-white px-4 h-12 w-full text-center p-3 bg-black' style={[styles.shadow]}>SALVAR</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )
                            :
                            (
                                <>
                                    <View className='flex-row justify-end'>
                                        <Pressable onPress={() => setIsEditing(true)}>
                                            <MaterialIcons className='px-3' name="edit" size={24} color="black" />
                                        </Pressable>
                                        <Pressable onPress={handleDeleteGuest}>
                                            <MaterialIcons name="delete" size={24} color="black" />
                                        </Pressable>
                                    </View>
                                    <View>
                                        <View>
                                            <Text className='font-bold text-xl'>{guest.name}</Text>
                                            <Text className='text-lg color-slate-600'>{guest.phone}</Text>
                                            <Text className='text-lg color-slate-600'>{guest.email}</Text>
                                        </View>
                                        <View className='flex-row justify-between py-6'>
                                            <Text className='text-xl'>Confirme a Presença:</Text>
                                            {guest.confirmation != undefined ? guest.confirmation == true ?
                                                <View className='flex-row'>
                                                    <Pressable>
                                                        <AntDesign className='px-10' name="checkcircle" size={24} color="green" />
                                                    </Pressable>
                                                    <Pressable onPress={() => { handlePresenceChange(false) }}>
                                                        <AntDesign name="closecircleo" size={24} color="grey" />
                                                    </Pressable>
                                                </View>
                                                :
                                                <View className='flex-row'>
                                                    <Pressable onPress={() => { handlePresenceChange(true) }}>
                                                        <AntDesign className='px-10' name="checkcircleo" size={24} color="grey" />
                                                    </Pressable>
                                                    <Pressable>
                                                        <AntDesign name="closecircle" size={24} color="red" />
                                                    </Pressable>
                                                </View>
                                                :
                                                <View className='flex-row'>
                                                    <Pressable onPress={() => { handlePresenceChange(true) }}>
                                                        <AntDesign className='px-10' name="checkcircleo" size={24} color="black" />
                                                    </Pressable>
                                                    <Pressable onPress={() => { handlePresenceChange(false) }}>
                                                        <AntDesign name="closecircleo" size={24} color="black" />
                                                    </Pressable>
                                                </View>
                                            }
                                        </View>
                                        {Array.isArray(guest.companion) && guest.companion.length > 0 && (
                                            <>
                                                <Text>Acompanhantes:</Text>
                                                <FlatList
                                                    data={guest.companion}
                                                    keyExtractor={(item, index) => `${index}`}
                                                    renderItem={renderCompanions}
                                                />
                                            </>
                                        )}
                                        <View>
                                        </View>

                                    </View>
                                    <View className='w-full flex-row justify-between'>
                                        <TouchableOpacity onPress={handleClose}>
                                            <Text className='rounded-md my-5 color-black px-4 h-12 w-full text-center p-3 bg-slate-100' style={[styles.shadow]}>SAIR</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                            <Text>Carregando...</Text>
                        )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, // Preenche toda a tela
        backgroundColor: 'rgba(24, 24, 24, 0.6)',
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
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
})