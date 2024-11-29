import React from "react";
import Button from "@/src/components/button";
import { View, FlatList, StyleSheet } from "react-native";

const buttonData = [
    { id: '1', label: 'DESCRIÇÃO' },
    { id: '2', label: 'TEMA' },
    { id: '3', label: 'DRESSCODE' },
    { id: '4', label: 'OUTRO' },
];

export default function MoreDetails() {
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
                            action={() => console.log(`Botão ${item.label} pressionado`)}
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
