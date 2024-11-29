import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

type SermonPlayerScreenProps = {
  route: any;
};

const SermonPlayerScreen: React.FC<SermonPlayerScreenProps> = ({ route }) => {
  const { video_link } = route.params; // Ensure video_link is passed as a parameter

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: video_link }}
        style={styles.webview}
        javaScriptEnabled
        allowsFullscreenVideo
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background for better video experience
  },
  webview: {
    flex: 1,
  },
});

export default SermonPlayerScreen;
