import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const NoticesScreen = ({ route }: { route: any }) => {
  const [notices, setNotices] = useState<any[]>([]); // Store the notices in state
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [error, setError] = useState<boolean>(false); // Track error state

  // Fetch notices function
  const fetchNotices = async (branchId: string) => {
    try {
      const response = await fetch(`http://192.168.100.5:7000/notices?branch_id=${branchId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setNotices(data);
        setLoading(false);
      } else {
        console.warn('Unexpected data format for notices:', data);
        setNotices([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
      setError(true);
      setLoading(false);
    }
  };

  // Get branchId from route params and fetch notices
  useEffect(() => {
    const { branchId } = route.params; // Assuming branchId is passed via navigation
    if (branchId) {
      fetchNotices(branchId);
    } else {
      setError(true); // Handle error if branchId is missing
      setLoading(false);
    }
  }, [route.params]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading notices...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching notices. Please try again later.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0A2647', '#273752']} style={styles.mainContainer}>
      <Text style={styles.screenTitle}>Notices</Text>

      {/* Scrollable list of notices */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notices && Array.isArray(notices) ? (
          notices.map((notice, index) => (
            <View key={index} style={styles.noticeCard}>
              {/* Card containing notice poster */}
              <View style={styles.innerCard}>
                <Image
                  source={{ uri: notice.poster_url }}
                  style={styles.noticePoster}
                  resizeMode="cover"
                />
                <Text style={styles.noticeEventName}>{notice.event_name}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noticeEventName}>No notices available</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
  },
  screenTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  noticeCard: {
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  innerCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noticePoster: {
    width: '100%',
    height: 450,
    borderRadius: 10,
  },
  noticeEventName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default NoticesScreen;
