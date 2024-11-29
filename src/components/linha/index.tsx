import { View } from 'react-native';

export default function Linha() {
    return (
        <View
            style={{
                width: 300,
                borderBottomColor: 'grey', // Cor da linha
                borderBottomWidth: 0.5,      // Espessura da linha
                opacity: 0.5        // Espaçamento acima e abaixo
            }}
        />
    );
}