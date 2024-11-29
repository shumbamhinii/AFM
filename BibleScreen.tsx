import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const BibleScreen: React.FC = ({ route, navigation }) => {
  const { book, chapter } = route.params || {};
  const [bibleText, setBibleText] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  const [highlightedVerses, setHighlightedVerses] = useState<Set<string>>(new Set());
  const [currentBookTitle, setCurrentBookTitle] = useState<string>('');
  const [currentBook, setCurrentBook] = useState<string>(book);
  const [currentChapter, setCurrentChapter] = useState<number>(chapter);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'CustomFont': require('./assets/Fredoka-VariableFont_wdth,wght.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const loadMoreData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newVerses = await getBibleText(currentIndex, 50);
      setBibleText((prev) => [...prev, ...newVerses]);
      setCurrentIndex((prev) => prev + 50);
      if (newVerses.length < 50) {
        setHasMore(false);
      }

      if (newVerses.length > 0) {
        setCurrentBookTitle(newVerses[0].book_name);
      }
    } catch (error) {
      console.error('Error loading Bible data:', error);
      Alert.alert('Error', 'Failed to load Bible text. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadBibleData = async (book: string, chapter: number) => {
    setLoading(true);
    try {
      const bibleData = require('./assets/bible.json'); // Replace with your JSON file path
      const filteredVerses = bibleData.verses.filter(
        (verse: any) => verse.book_name === book && verse.chapter === chapter
      );

      if (filteredVerses.length === 0) {
        Alert.alert('End of Chapter', 'You have reached the end of the Bible.');
        return;
      }

      setBibleText(filteredVerses);
    } catch (error) {
      console.error('Error loading Bible data:', error);
      Alert.alert('Error', 'Failed to load Bible text. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentBook && currentChapter) {
      loadBibleData(currentBook, currentChapter);
    }
  }, [currentBook, currentChapter]);

  useEffect(() => {
    loadMoreData();
  }, []);

  const getBibleText = async (startIndex: number, limit: number): Promise<any[]> => {
    try {
      const bibleData = require('./assets/bible.json');
      const allVerses = bibleData.verses.slice(startIndex, startIndex + limit);
      return allVerses;
    } catch (error) {
      console.error('Error loading Bible data:', error);
      throw new Error('Error loading Bible data');
    }
  };

  const groupVersesByBookAndChapter = (verses: any[]) => {
    const grouped: any[] = [];
    let currentBook = '';
    let currentChapter = 0;

    verses.forEach((verse) => {
      if (verse.book_name !== currentBook || verse.chapter !== currentChapter) {
        currentBook = verse.book_name;
        currentChapter = verse.chapter;
        grouped.push({
          book_name: currentBook,
          chapter: currentChapter,
          verses: [verse],
        });
      } else {
        grouped[grouped.length - 1].verses.push(verse);
      }
    });

    return grouped;
  };

  const toggleHighlight = (verseId: string) => {
    setHighlightedVerses((prev) => {
      const updated = new Set(prev);
      if (updated.has(verseId)) {
        updated.delete(verseId);
      } else {
        updated.add(verseId);
      }
      return updated;
    });
  };

  const renderVersesAsContinuousText = (verses: any[]) => {
    return (
      <Text style={styles.continuousText}>
        {verses.map((verse: any, index: number) => {
          const verseId = `${verse.book_name}-${verse.chapter}-${verse.verse}`;
          const isHighlighted = highlightedVerses.has(verseId);
          return (
            <Text
              key={index}
              style={[styles.verseText, isHighlighted && styles.highlightedVerse]}
              onPress={() => toggleHighlight(verseId)}
            >
              <Text style={styles.verseNumber}>{toSuperscript(verse.verse)}</Text> {verse.text}{' '}
            </Text>
          );
        })}
      </Text>
    );
  };

  const toSuperscript = (num: number) => {
    const superscriptMap = {
      '0': '⁰',
      '1': '¹',
      '2': '²',
      '3': '³',
      '4': '⁴',
      '5': '⁵',
      '6': '⁶',
      '7': '⁷',
      '8': '⁸',
      '9': '⁹',
    };
    return String(num)
      .split('')
      .map((digit) => superscriptMap[digit])
      .join('');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View>
      <View style={styles.chapterHeader}>
        <Text style={styles.bookName}>{item.book_name}</Text>
        <Text style={styles.chapterNumber}>{item.chapter}</Text>
      </View>
      {renderVersesAsContinuousText(item.verses)}
    </View>
  );

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#FFA500" />;
  }

  return (
    <LinearGradient colors={['#0A2647', '#273752']} style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="volume-high-outline" size={24} color="#FFF" style={styles.icon} />
        <Ionicons name="search-outline" size={24} color="#FFF" style={styles.icon} />
        <TouchableOpacity style={styles.versionButton}>
          <Text style={styles.versionText}>NIV</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={groupVersesByBookAndChapter(bibleText)}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.book_name}-${item.chapter}-${index}`}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#FFA500" /> : null}
      />
      <LinearGradient colors={['#273752', '#0A2647']} style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('BookListScreen')}>
          <Text style={styles.footerText}>{currentBookTitle}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  //const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 60,
    },
    header: {
      position: 'absolute',
      top: 50,
      right: 10,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 10,
      backgroundColor: 'rgba(10, 38, 71, 0.8)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
    },
    icon: {
      marginRight: 15,
    },
    versionButton: {
      backgroundColor: '#555',
      padding: 5,
      borderRadius: 5,
    },
    versionText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    chapterHeader: {
      alignItems: 'center',
      marginVertical: 40,
    },
    bookName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFA500',
      fontFamily: 'CustomFont',
    },
    chapterNumber: {
      fontSize: 40,
      color: '#FFA500',
      fontFamily: 'CustomFont',
      fontWeight: 'bold',
    },
    continuousText: {
      fontSize: 20,
      color: '#FFF',
      fontFamily: 'CustomFont',
      lineHeight: 26,
    },
    verseNumber: {
      fontSize: 12,
      color: '#FFA500',
      fontFamily: 'CustomFont',
    },
    verseText: {
      fontSize: 20,
      fontFamily: 'CustomFont',
      color: '#FFFFFF',
      textAlign: 'left',
      marginBottom: 10,
    },
    highlightedVerse: {
      backgroundColor: '#a6e1c5', // Highlight color
      borderRadius: 5,
    },

  footer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'CustomFont',
  },
});

export default BibleScreen;
