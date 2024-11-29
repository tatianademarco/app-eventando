import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Home } from './screens/home'
import { Guests } from './screens/guests'
import { Budget } from './screens/budget'

const Tab = createBottomTabNavigator();

export function Routes() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name='home'
                component={Home}
            />
            <Tab.Screen
                name='guests'
                component={Guests}
            />
            <Tab.Screen
                name='budget'
                component={Budget}
            />
        </Tab.Navigator>
    );
}