import React from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Use the useNavigation hook

type FeaturedSermonProps = {
  videoUrl: string;
  title: string;
};

const FeaturedSermon: React.FC<FeaturedSermonProps> = ({ videoUrl, title }) => {
  const navigation = useNavigation(); // Get navigation from the hook

  return (
    <LinearGradient
      colors={['#0A2647', '#3F586B']}
      style={styles.featuredSermonCard}
    >
      <Text style={styles.featuredSermonTitle}>{title}</Text>
      <View style={styles.videoContainer}>
        <LinearGradient
          colors={['#0A2647', '#3F586B']}
          style={styles.videoGradient}
        >
          <Video
            source={{ uri: videoUrl }}
            style={styles.videoPlayer}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        </LinearGradient>
      </View>
      <Button
        title="Watch Full Sermon"
        onPress={() => navigation.navigate('Sermons')} // Use the navigation object from the hook
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  featuredSermonCard: {
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  featuredSermonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFA500',
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  videoGradient: {
    flex: 1,
    borderRadius: 10,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default FeaturedSermon;
