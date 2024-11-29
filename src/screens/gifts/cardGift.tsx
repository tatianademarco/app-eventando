import { Pressable, View, Text, StyleSheet } from 'react-native';

export default function CardGift() {
    return (
        <Pressable className='w-1/3 bg-white self-center rounded-md' style={styles.shadow}>
            {/* <View className='items-center justify-around p-3'>
                <View className=' w-11/12 bg-slate-400 self-center rounded-md'>

                </View>
                <Text className='font-bold text-lg'>Tatiana Demarco</Text>
                <Text className='color-slate-400'>Esperando confirmação</Text>
            </View>
            <Text className='mx-7 mb-4'>2 acompanhantes</Text> */}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    shadow:
    {
        shadowColor: '#000', // Cor da sombra
        shadowOffset: { width: 0, height: 2 }, // Offset da sombra
        shadowOpacity: 0.15, // Opacidade da sombra
        shadowRadius: 3.5, // Raio da sombra
        elevation: 4, // Para Android
    }
});