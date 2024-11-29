import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

type Announcement = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

type AnnouncementsScreenProps = {
  route: any;
};

const AnnouncementsScreen = ({ route }: AnnouncementsScreenProps) => {
  // Safely extract branch_id with a fallback
  const branch_id = route?.params?.branch_id || 'AFM000'; // Fallback to default branch_id
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`http://192.168.100.5:7000/announcements?branch_id=${branch_id}`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Fetch announcements on mount
  }, [branch_id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={styles.loadingText}>Loading Announcements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{`Posted on ${new Date(item.created_at).toLocaleDateString()}`}</Text>
            <Text style={styles.contentText}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No announcements available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60, // Add space at the top of the screen
    backgroundColor: '#0A2647',
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#273752',
    borderRadius: 10,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
  },
  date: {
    fontSize: 14,
    color: '#B0B0B0',
    marginVertical: 4,
  },
  contentText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A2647',
  },
  loadingText: {
    color: '#FFA500',
    fontSize: 18,
    marginTop: 10,
  },
  emptyText: {
    color: '#FFA500',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});


export default AnnouncementsScreen;
