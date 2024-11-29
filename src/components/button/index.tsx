import { Feather } from '@expo/vector-icons';
import { Pressable, View, Text} from 'react-native';

interface Props {
    text: string;
    size: "text-lg" | "text-sm";
    width: string;
    height: string;
    marginTop: string;
    action: () => void;
}

export default function Button({ text, size, width, height, marginTop, action }: Props) {
    return (
        <View className={`w-full flex items-end ${marginTop} mb-7`}>
            <Pressable className={`${width} ${height} bg-white rounded-full flex-row justify-center items-center`}
                style={{
                    shadowColor: '#000', // Cor da sombra
                    shadowOffset: { width: 0, height: 2 }, // Offset da sombra
                    shadowOpacity: 0.15, // Opacidade da sombra
                    shadowRadius: 3.5, // Raio da sombra
                    elevation: 4, // Para Android
                }}
                onPress={action}
            >
                <Feather name='plus' size={22} color="#121212" />
                <Text className={`${size} ml-2`}
                    style={{
                        fontFamily: 'Roboto-Medium',
                        letterSpacing: 1
                    }}
                >
                    {text}
                </Text>
            </Pressable>
        </View>
    );
}