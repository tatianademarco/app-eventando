import React from "react";
import Button from "@/src/components/button";
import { View, FlatList, StyleSheet } from "react-native";

interface Props {
    setModalVisible: (service : string) => void;
}

const buttonData = [
    { id: '1', label: 'DECORAÇÃO' },
    { id: '2', label: 'BUFFET' },
    { id: '3', label: 'FOTOGRAFICA' },
    { id: '4', label: 'LOCAÇÃO' },
    { id: '5', label: 'MÚSICA' },
    { id: '6', label: 'CERIMONIAL' },
    { id: '7', label: 'CABELO E MAQUIAGEM' },
    { id: '8', label: 'VESTIDO' },
    { id: '9', label: 'OUTRO' },
];

export default function Services({ setModalVisible }: Props) {
    return (
        <View style={styles.container}>
            <FlatList
                data={buttonData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="mr-4">
                        <Button
                            text={item.label}
                            size="text-sm"
                            width="w-40"
                            height="h-10"
                            marginTop="mt-5"
                            action={() => setModalVisible(item.label)}
                        />
                    </View>
                )}
                horizontal={true} // Define a FlatList como horizontal
                showsHorizontalScrollIndicator={false} // Oculta o indicador de rolagem horizontal
                contentContainerStyle={styles.list} // Estilos para o conteúdo interno
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Centraliza os itens verticalmente
        alignItems: 'center', // Centraliza os itens horizontalmente
    },
    list: {
        flexGrow: 1, // Permite que a FlatList cresça conforme necessário
    },
});
