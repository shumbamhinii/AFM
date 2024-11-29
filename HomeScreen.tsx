import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Button, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './Header';
import FeaturedSermon from './FeaturedSermon';
import SermonsScreen from './SermonsScreen'
import { Asset } from 'expo-asset';

type AppScreenProps = {
  navigation: NavigationProp<any>;
};

export default function AppScreen({ navigation }: AppScreenProps) {
  const [selectedBranch, setSelectedBranch] = useState<any>({ branch_id: 'AFM000' }); // Default branch
  const [branchContent, setBranchContent] = useState<string>('Loading...');
  const [devotions, setDevotions] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]); // State for announcements
  const [notices, setNotices] = useState<any[]>([]);
  const fetchDevotions = async (branchId: string) => {
    try {
      const response = await fetch(`http://192.168.100.5:7000/devotions?branch_id=${branchId}`);
      const data = await response.json();
      setDevotions(data);

      if (data.length > 0) {
        setBranchContent(data[0].content);
      } else {
        setBranchContent('No devotions available for this branch.');
      }
    } catch (error) {
      console.error('Error fetching devotions:', error);
      setBranchContent('Error fetching devotion content.');
    }
  };

  const fetchAnnouncements = async (branchId: string) => {
    try {
      const response = await fetch(`http://192.168.100.5:7000/announcements?branch_id=${branchId}`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };
const fetchNotices = async (branchId: string) => {
  try {
    const response = await fetch(`http://192.168.100.5:7000/notices?branch_id=${branchId}`);
    const data = await response.json();

    if (Array.isArray(data)) {
      setNotices(data);
    } else {
      console.warn('Unexpected data format for notices:', data);
      setNotices([]); // Fallback to an empty array
    }
  } catch (error) {
    console.error('Error fetching notices:', error);
    setNotices([]); // Ensure the state is an array even on error
  }
};
;

  useEffect(() => {
    fetchDevotions(selectedBranch.branch_id);
    fetchAnnouncements(selectedBranch.branch_id);
    fetchNotices(selectedBranch.branch_id); // Fetch notices
  }, [selectedBranch]);


  return (
    <View style={styles.container}>
      {/* Header */}
      <Header setSelectedBranch={setSelectedBranch} />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Horizontal Scroll for Main Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollMain}
        >
<LinearGradient colors={['#0A2647', '#273752']} style={styles.mainDevotionCard}>
  <Text style={styles.devotionTitle}>{selectedBranch.name}</Text>

  {/* Scrollable list of notices */}
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

  <Button
    title="View All Notices"
    onPress={() => navigation.navigate('Notices', { branchId: selectedBranch.branch_id })}
    color="#FFA500"
  />
</LinearGradient>


          {/* Main Devotion Card */}
          <LinearGradient colors={['#0A2647', '#273752']} style={styles.mainDevotionCard}>
            <Text style={styles.devotionTitle}>{selectedBranch.name}</Text>
            <Text style={styles.devotionSnippet}>
              {branchContent.split(' ').slice(0, 70).join(' ')}...
            </Text>
            <Button
              title="Continue Reading"
              onPress={() => navigation.navigate('Daily Devotion')}
              color="#FFA500"
            />
          </LinearGradient>

          {/* Announcements Card */}
          <LinearGradient colors={['#0A2647', '#273752']} style={styles.mainDevotionCard}>
            <Text style={styles.devotionTitle}>Announcements</Text>
            <ScrollView style={styles.announcementList}>
              {announcements.slice(0, 3).map((announcement, index) => (
                <Text key={index} style={styles.announcementSnippet}>
                  {index + 1}. {announcement.content.substring(0, 200)}...

                </Text>

              ))}
            </ScrollView>
            <Button
              title="Announcements"
              onPress={() => navigation.navigate('Announcements', { branchId: selectedBranch.branch_id })}
              color="#FFA500"
            />
          </LinearGradient>


        </ScrollView>

        {/* Horizontal Scroll for Daily Devotions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {/* Daily Devos Card 1 */}
          <LinearGradient colors={['#0A2647', '#273752']} style={styles.dailyDevosCard}>
            <Text style={styles.devotionTitle}>Bible Guide</Text>
            <Text style={styles.devotionContent}>
              Today's Bible Study: Proverbs 3:5-6. Trust in the Lord with all...
            </Text>
            <Button
              title="Continue Reading"
              onPress={() => navigation.navigate('BibleGuide')}
              color="#FFA500"
            />
          </LinearGradient>

          {/* Daily Devos Card 2 */}
          <LinearGradient colors={['#0A2647', '#273752']} style={styles.dailyDevosCard}>
            <Text style={styles.devotionTitle}>Today's Word</Text>
            <Text style={styles.devotionContent}>
              "For I know the plans I have for you," declares the Lord...
            </Text>
            <Button
              title="Continue Reading"
              onPress={() => navigation.navigate('TodaysWord')}
              color="#FFA500"
            />
          </LinearGradient>

          {/* Daily Devos Card 3 */}
          <LinearGradient colors={['#0A2647', '#273752']} style={styles.dailyDevosCard}>
            <Text style={styles.devotionTitle}>Daily Devotion</Text>
            <Text style={styles.devotionContent}>
              {devotions.length > 0 ? devotions[0].content.substring(0, 90) : 'No devotion available'}...
            </Text>
            <Button
              title="Go to Daily Devotion"
              onPress={() => navigation.navigate('Daily Devotion')}
              color="#FFA500"
            />
          </LinearGradient>
        </ScrollView>

        {/* Featured Sermon Section */}
        <FeaturedSermon
          videoUrl={Asset.fromModule(require('./assets/sermon.mp4')).uri}
          title="The Power of Faith"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2647',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },

    mainDevotionCard: {
      width: 300,
      height: 500,
      borderRadius: 20,
      overflow: 'hidden',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 10,
      marginRight: 20,
    },
    announcementList: {
      flex: 1,
      paddingHorizontal: 10,
      marginVertical: 10,
    },
    announcementSnippet: {
      color: '#fff',
      fontSize: 16,
      marginBottom: 5,
      textAlign: 'left',
      paddingHorizontal: 10,
    },
  horizontalScrollMain: {
    paddingVertical: 20,
  },
  horizontalScroll: {
    paddingVertical: 20,
  },
  dailyDevosCard: {
    padding: 20,
    borderRadius: 12,
    width: 300,
    marginRight: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    justifyContent: 'center',
  },
  devotionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFA500',
  },
  devotionSnippet: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 0,
    paddingHorizontal: 20,
  },
  announcementSnippet: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  noticeList: {
      flex: 1,
      paddingHorizontal: 10,
      marginVertical: 10,
    },
noticeCard: {
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#1B263B',
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  innerCard: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  noticePoster: {
    width: 250,
    height: 350,
    borderRadius: 8,
  },
  noticeEventName: {
    marginTop: 5,
    textAlign: 'center',
    color: '#0A2647',
    fontWeight: 'bold',
  },
    horizontalScrollMain: {
      paddingVertical: 20,
    },
  devotionContent: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 20,
  },
});
