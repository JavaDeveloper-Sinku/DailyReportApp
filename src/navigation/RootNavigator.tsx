import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ReportScreen from '../screens/ReportScreen';
import NotificationScreen from '../screens/NotificationScreen';

import ReportListScreen from '../screens/ReportListScreen';
import ReportEditScreen from '../screens/ReportEditScreen';


export type RootStackParamList = {
  Home: undefined;
  
  Profile: undefined;
  Report: undefined;
  Notification: undefined;

  ReportList: undefined;
  ReportEdit: { reportId: string } | undefined;
  

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,

        }}
          
        >



        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: "Daily Report" }}
        />
    
        <Stack.Screen 
          name="Profile" 
          component={UserProfileScreen} 
          options={{ title: "User Profile" }}
        />
        <Stack.Screen 
          name="Report" 
          component={ReportScreen} 
          options={{ title: "Report" }}
        />
        <Stack.Screen 
          name="Notification" 
          component={NotificationScreen} 
          options={{ title: "Notifications" }}
        />
      
        <Stack.Screen 
          name="ReportList" 
          component={ReportListScreen} 
          options={{ title: "Report List" }}
        />
       <Stack.Screen 
          name="ReportEdit" 
          component={ReportEditScreen} 
          options={{ title: "Edit Report" }}
        />
       
        


      </Stack.Navigator>
    </NavigationContainer>
  );
}
