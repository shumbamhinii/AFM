import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import AppLoading from 'expo-app-loading'; // For font loading
import * as Font from 'expo-font';
import Header from './Header';

const DailyDevotionScreen: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>({ branch_id: 'AFM000' }); // Default branch
  const [devotions, setDevotions] = useState<any[]>([]);
  const [currentDevotion, setCurrentDevotion] = useState<string>('Loading...');
  const [devotionTitle, setDevotionTitle] = useState<string>('Daily Devotion'); // Default title

  // Function to fetch devotions based on branchId
  const fetchDevotions = async (branchId: string) => {
    try {
      const response = await fetch(`http://192.168.100.5:7000/devotions?branch_id=${branchId}`);
      const data = await response.json();
      setDevotions(data);

      if (data.length > 0) {
        setDevotionTitle(data[0].title); // Set title dynamically
        setCurrentDevotion(data[0].content); // Display the first devotion by default
      } else {
        setDevotionTitle('No Devotions Available'); // Fallback title
        setCurrentDevotion('No devotions available for this branch.');
      }
    } catch (error) {
      console.error('Error fetching devotions:', error);
      setDevotionTitle('Error'); // Set error title if fetching fails
      setCurrentDevotion('Error fetching devotion content.');
    }
  };

  // Load custom fonts
  const loadFonts = async () => {
    await Font.loadAsync({
      'CustomFont': require('./assets/Fredoka-VariableFont_wdth,wght.ttf'),
    });
    setFontsLoaded(true);
  };

  // UseEffect hook to load fonts and fetch devotions on branch change
  useEffect(() => {
    loadFonts();
    fetchDevotions(selectedBranch.branch_id); // Fetch devotions whenever the branch changes
  }, [selectedBranch]); // Re-fetch devotions if selectedBranch changes

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <LinearGradient colors={['#0A2647', '#1F3B4D']} style={styles.container}>
      {/* Header for Branch Selection */}
      <Header setSelectedBranch={setSelectedBranch} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Display the dynamic devotion title */}
        <Text style={styles.title}>{devotionTitle}</Text>

        {/* Display devotion content */}
        <Text style={styles.contentText}>{currentDevotion}</Text>

        {/* Conditionally Render Video */}
        {devotions.length > 0 && devotions[0].videoUrl ? (
          <Video
            source={{ uri: devotions[0].videoUrl }}
            style={styles.videoPlayer}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        ) : (
          <Text style={styles.noVideoText}>No video available for today's devotion.</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2647',
  },
  content: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 16,
    marginTop: 30,
  },
  contentText: {
    fontSize: 20,
    fontFamily: 'CustomFont',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'left',
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  noVideoText: {
    fontSize: 16,
    color: '#FFA500',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default DailyDevotionScreen;
