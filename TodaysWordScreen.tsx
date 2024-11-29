import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

type TodaysWordScreenProps = {
  navigation: NavigationProp<any>;
};

const todaysWordContent = `\
"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."
- Jeremiah 29:11

Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.
- Proverbs 3:5-6
`;

const TodaysWordScreen = ({ navigation }: TodaysWordScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade in to full opacity
      duration: 1000, // Duration of fade effect
      useNativeDriver: true, // Use native driver for performance
    }).start();
  }, [fadeAnim]);

  return (
    <LinearGradient
      colors={['#0A2647', '#3F586B']} // Gradient colors
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{ ...styles.titleContainer, opacity: fadeAnim }}>
          <Text style={styles.title}>Today's Word</Text>
        </Animated.View>
        <View style={styles.card}>
          <Text style={styles.wordContent}>{todaysWordContent}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 30, // Increased font size
    fontWeight: 'bold',
    color: '#FFA500',
  },
  card: {
    backgroundColor: '#1F3A57', // Card background color
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  wordContent: {
    fontSize: 20, // Increased font size
    color: '#FFF',
    lineHeight: 28,
  },
});

export default TodaysWordScreen;
