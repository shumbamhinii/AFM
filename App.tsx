import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import DailyDevotionScreen from './DailyDevotionScreen'; // Make sure to import your DailyDevotionScreen
import TodaysWordScreen from './TodaysWordScreen';
import BibleScreen from './BibleScreen';
import BibleGuideScreen from './BibleGuideScreen';
import BookListScreen from './BookListScreen';
import AnnouncementsScreen from './AnnouncementsScreen'
import SermonsScreen from './SermonsScreen';
import SermonPlayerScreen from './SermonPlayerScreen';
import NoticesScreen from './NoticesScreen'
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Hide the header for HomeScreen
        />
        <Stack.Screen
          name="Daily Devotion"
          component={DailyDevotionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
           name="TodaysWord"
           component={TodaysWordScreen}
           options={{ headerShown: false }}
                />
         <Stack.Screen
           name="Bible"
           component={BibleScreen}
           options={{ headerShown: false }}
                />
         <Stack.Screen
           name="Announcements"
           component={AnnouncementsScreen}
           options={{ headerShown: false }}
                />
         <Stack.Screen
           name="BookListScreen"
           component={BookListScreen}
           options={{ headerShown: false }}
                />
<Stack.Screen
           name="BibleGuide"
           component={BibleGuideScreen}
           options={{ headerShown: false }}
                />
     <Stack.Screen
               name="Notices"
               component={NoticesScreen}
               options={{ headerShown: false }}
                    />           
  <Stack.Screen
                name="SermonPlayer"
                component={SermonPlayerScreen}
                options={{ headerShown: false }}
                     />
    <Stack.Screen
               name="Sermons"
               component={SermonsScreen}
               options={{ headerShown: false }}
                    />
                    
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
