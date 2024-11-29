import { View, Pressable, Image } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

interface Props {
    uriImage?: string;
    onImageChange: (uri: string) => void;
}

export function MainImage({ uriImage, onImageChange }: Props) {
    const [image, setImage] = useState<string | null>(uriImage || null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [6, 2],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Atualiza o estado da imagem
            onImageChange(result.assets[0].uri);
        }
    };

    return (
        <View className="w-full h-36 rounded-2xl mt-5 mb-4">
            <Pressable
                className="w-full h-28 md:h-60 rounded-2xl bg-slate-100 justify-center items-center"
                onPress={pickImage}
            >
                {image ? (
                    <Image source={{ uri: image }} className="w-full h-36 md:h-60 rounded-2xl" />
                ) : (
                    <FontAwesome6 name="image" size={50} color="grey" />
                )}
            </Pressable>
        </View>
    );
}
