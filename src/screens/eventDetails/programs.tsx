import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';
import { Program } from './index';
import Linha from '@/src/components/linha';

interface Props {
    programs: Program[];
    action: () => void;
}

export default function Programs({ programs, action }: Props) {
    return (
        <Pressable
            className="flex items-center bg-white m-5 rounded-2xl"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3.5,
                elevation: 2,
            }}
            onPress={action}
        >
            {programs.map((program, index) => (
                <View key={index}>
                <View className="m-8 items-center">
                    <View className="flex-row">
                        <Text className="font-bold text-lg">{program.description}</Text>
                        <Text className="text-lg"> - </Text>
                        <Text className="text-lg">{program.time}h</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name='location-sharp' size={22} color="red" />
                        <Text className="text-lg">{program.location}</Text>
                    </View>
                    </View>
                    {/* Linha separadora */}
                    {index < programs.length - 1 && (
                        <Linha/>
                    )}
                </View>
            ))}

        </Pressable>
    );
}
