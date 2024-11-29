import { ScrollView, View, StyleSheet, Text, Modal, Pressable, FlatList } from 'react-native';
import Services from './services';
import SuppliersLegend from './suppliersLegend';
import { useCallback, useState } from 'react';
import ModalAddService from './modalAddService';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

interface Service {
    service: string;
    suppliers: Supplier[];
    event: string;
}

interface Supplier {
    name: string;
    observation: string;
    value: number | undefined;
    contact: string;
    type: 'total' | 'porConvidado';
    methodPayment: string;
}

interface EventScreenProps {
    route?: { params: { eventId: string } }; // Define que o evento é da rota "Event" e espera um parâmetro "eventId"
}

type EventScreenRouteProp = RouteProp<{ params: { eventId: string } }, 'params'>;

export default function Suppliers() {
    const route = useRoute<EventScreenRouteProp>();
    const eventId = route.params?.eventId || 'ID não encontrado';
    const [modalVisible, setModalVisible] = useState(false);
    const [serviceName, setServiceName] = useState<string | null>(null);
    const [services, setServices] = useState<Service[]>([]);

    const fetchGuests = useCallback(() => {
        let query = firestore().collection('services').where('event', '==', eventId);

        const unsubscribe = query.onSnapshot(snapshot => {
            const servicesList = snapshot.docs.map(doc => ({
                ...doc.data(),
            })) as Service[];

            setServices(servicesList);

        });
        // Retorna a função de desinscrição para parar de ouvir atualizações quando o componente desmontar
        return unsubscribe;
    }, [eventId]);

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = fetchGuests();
            return () => unsubscribe();
        }, [fetchGuests])
    );

    // Função para abrir o modal e setar o nome do serviço
    const openModalWithService = (name: string) => {
        setServiceName(name);
        setModalVisible(true);
    };

    const renderServicesItens = ({ item }: { item: Service }) => (
        <View
            className="bg-white mt-4 rounded-2xl"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3.5,
                elevation: 1,
            }}
        >
            <Text className="m-5 font-bold text-xl">{item.service}</Text>
            <View
                style={{
                    width: '100%',
                    borderBottomColor: 'grey',
                    borderBottomWidth: 0.5,
                    opacity: 0.5,
                }}
            />
            {item.suppliers.map((supplier, index) => (
                <View key={index} className="mx-5 mt-5">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-lg italic">{supplier.name}</Text>
                        <Text className="text-slate-400">{supplier.contact}</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Text className="text-lg">Valor total: </Text>
                        <Text className="italic font-bold">
                            {supplier.type === 'total'
                                ? supplier.value?.toLocaleString('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                  })
                                : `${supplier.value?.toLocaleString('pt-BR')}`}
                        </Text>
                    </View>
                    {index < item.suppliers.length - 1 ? (
                        <View
                            style={{
                                alignSelf: 'center',
                                width: 300,
                                borderBottomColor: 'grey',
                                borderBottomWidth: 0.5,
                                opacity: 0.5,
                                paddingBottom: 20
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                margin: 12
                            }}
                            />
                    )}
                
                </View>
            ))}
        </View>
    );
    
    return (
        <View style={{ flex: 1 }} className='p-6'>
            <View className='h-52'>
                <View className='flex-row justify-center'>
                    <Text className='m-5'>Adicione os fornecedores e os valores pesquisados para cada serviço:</Text>
                    <SuppliersLegend />
                </View>

                <Services setModalVisible={openModalWithService} />

                <View className='w-11/12 self-center m-5'
                    style={{
                        borderBottomColor: 'grey', // Cor da linha
                        borderBottomWidth: 0.5,      // Espessura da linha
                        opacity: 0.8  ,      // Espaçamento acima e abaixo
                    }}
                />
                </View>
                {services ? (
                <FlatList
                    data={services}
                    keyExtractor={(item, index) => `${item.service}-${index}`}
                    renderItem={renderServicesItens}
                />
            ) : (
                <Text className="m-5 text-center">
                    Nenhum fornecedor cadastrado até o momento
                </Text>
            )}

                {/* <Text className='m-5 text-center'>Nenhum serviço cadastrado até o momento</Text> */}

                {/* <View className="bg-white mt-4 rounded-2xl"
                    style={{
                        shadowColor: '#000', // Cor da sombra
                        shadowOffset: { width: 0, height: 2 }, // Offset da sombra
                        shadowOpacity: 0.15, // Opacidade da sombra
                        shadowRadius: 3.5, // Raio da sombra
                        elevation: 1, // Para Android
                    }}>

                    <Text className="m-5 font-bold text-xl">Decoração</Text>
                    <View
                        style={{
                            width: '100%',
                            borderBottomColor: 'grey', // Cor da linha
                            borderBottomWidth: 0.5,      // Espessura da linha
                            opacity: 0.5        // Espaçamento acima e abaixo
                        }}
                    />
                    <View className="mx-5 m-5">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-lg italic">DeCoração</Text>
                            <Text className='color-slate-400'> (54) 9967-5874</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-lg">Valor total: </Text>
                            <Text className='italic font-bold'>R$ 3200,00</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            alignSelf: 'center',
                            width: 300,
                            borderBottomColor: 'grey', // Cor da linha
                            borderBottomWidth: 0.5,      // Espessura da linha
                            opacity: 0.5        // Espaçamento acima e abaixo
                        }}
                    />

                    <View className="mx-5 m-5">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-lg italic">Empresa 2</Text>
                            <Text className='color-slate-400'> (54) 9967-5874</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-lg">Valor total: </Text>
                            <Text className='italic font-bold'>R$ 2800,00</Text>
                        </View>
                    </View>
                </View> */}

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <ModalAddService
                    handleClose={() => setModalVisible(false)}
                    eventId={eventId}
                    serviceName={serviceName!}
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
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.5,
        elevation: 4,
    }
});