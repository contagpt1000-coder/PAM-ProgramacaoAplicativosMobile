import React from 'react';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { NovoAgendamentoScreen } from '../screens/NovoAgendamentoScreen';
import { DetalhesAgendamentoScreen } from '../screens/DetalhesAgendamentoScreen';
import { COLORS } from '../constants/colors';

export type RootStackParamList = {
  Home: undefined;
  NovoAgendamento: undefined;
  DetalhesAgendamento: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NovoAgendamento" component={NovoAgendamentoScreen} />
      <Stack.Screen name="DetalhesAgendamento" component={DetalhesAgendamentoScreen} />
    </Stack.Navigator>
  );
};
