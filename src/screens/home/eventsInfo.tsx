import { useCallback, useEffect, useState } from 'react';
import { View, Pressable, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from 'expo-router';

interface Props {
    navigation: (id: string, name: string) => void;
}

interface Event {
    id: string;
    name: string;
    image: string;
    date: { seconds: number, nanoseconds: number };
}

export function EventsInfo({ navigation }: Props) {
    const [events, setEvents] = useState<Event[]>([]);

    useFocusEffect(
        useCallback(() => {
            const fetchEvents = async () => {
                const snapshot = await firestore().collection('eventos').get();
                const eventsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Event[];
                setEvents(eventsList);
            };
    
            fetchEvents();
    
            // Você pode retornar uma função de limpeza se necessário
            return () => {
                // Limpeza opcional aqui, se necessário
            };
        }, [])
    );

    const handleEventPress = (eventId: string, eventName:string) => {
        navigation(eventId, eventName);
    };

    const renderEventItem = ({ item }: { item: Event }) => {
        const imageSource = item.image
            ? { uri: item.image }
            : require('../../assets/comemoracao-aniversario-inesquecivel.png'); // Imagem padrão local

        return (
            <Pressable onPress={() => handleEventPress(item.id, item.name)} className='w-full h-36 md:h-60 rounded-2xl mb-5'>
                <ImageBackground source={imageSource}
                    className='w-full h-36 md:h-60 justify-end'
                    style={styles.background}
                    imageStyle={styles.image}
                >
                    <View style={styles.overlay} className='items-end'>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.subText}>{formatDate(item.date)}</Text>
                    </View>
                </ImageBackground>
            </Pressable>
        );
    };

    const formatDate = (timestamp: { seconds: number, nanoseconds: number }) => {
        const date = new Date(timestamp.seconds * 1000);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')
            }/${date.getFullYear()}`;
    };

    return (
        <View className='w-full h-full rounded-2xl mt-5 mb-4'>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={renderEventItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1, // Preenche toda a tela
        borderRadius: 16, // Aplica o arredondamento
        overflow: 'hidden',
    },
    image: {
        opacity: 0.8,
        borderRadius: 16,
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor de sobreposição para melhorar a legibilidade
        padding: 20,
        borderRadius: 10,
    },
    text: {
        color: '#fff', // Cor do texto principal
        fontSize: 20,
        fontWeight: 'bold',
    },
    subText: {
        color: '#fff', // Cor do texto secundário
        fontSize: 14,
    },
});