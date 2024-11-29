import { View, Pressable, Text, Image, ImageBackground } from 'react-native';
import PagerView from 'react-native-pager-view';

export function Banner() {
 return (
   <View className='w-full h-36 rounded-2xl mt-5 mb-4'>
    <PagerView style={{flex:1}} initialPage={0} pageMargin={14}>
        <Pressable className='w-full h-36 md:h-60 rounded-2xl'
        key="1"
        onPress={() => console.log("Clicou no banner 1")}>
          <Image source={require("../../assets/785b567b-5359-4079-af6c-c87b7d08fc0d.jpg")}
          className='w-full h-36 md:h-60 rounded-2xl'/>
        </Pressable>

        

        {/* <Pressable className='w-full h-36 md:h-60 rounded-2xl'
        key="2"
        onPress={() => console.log("Clicou no banner 2")}>
          <Image source={require("../../assets/estilos-de-decoracao-em-alta-nos-casamento-e13597a971143170e4e9.jpg")}
          className='w-full h-36 md:h-60 rounded-2xl'/>
        </Pressable> */}
    </PagerView>
   </View>
  );
}