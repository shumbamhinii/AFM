import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Import for navigation

// Example Bible data
const bibleData = {
  "Genesis": { "chapters": 50 },
  "Exodus": { "chapters": 40 },
  "Leviticus": { "chapters": 27 },
  "Numbers": { "chapters": 36 },
  "Deuteronomy": { "chapters": 34 },
  "Joshua": { "chapters": 24 },
  "Judges": { "chapters": 21 },
  "Ruth": { "chapters": 4 },
  "1 Samuel": { "chapters": 31 },
  "2 Samuel": { "chapters": 24 },
  "1 Kings": { "chapters": 22 },
  "2 Kings": { "chapters": 25 },
  "1 Chronicles": { "chapters": 29 },
  "2 Chronicles": { "chapters": 36 },
  "Ezra": { "chapters": 10 },
  "Nehemiah": { "chapters": 13 },
  "Esther": { "chapters": 10 },
  "Job": { "chapters": 42 },
  "Psalms": { "chapters": 150 },
  "Proverbs": { "chapters": 31 },
  "Ecclesiastes": { "chapters": 12 },
  "Song of Solomon": { "chapters": 8 },
  "Isaiah": { "chapters": 66 },
  "Jeremiah": { "chapters": 52 },
  "Lamentations": { "chapters": 5 },
  "Ezekiel": { "chapters": 48 },
  "Daniel": { "chapters": 12 },
  "Hosea": { "chapters": 14 },
  "Joel": { "chapters": 3 },
  "Amos": { "chapters": 9 },
  "Obadiah": { "chapters": 1 },
  "Jonah": { "chapters": 4 },
  "Micah": { "chapters": 7 },
  "Nahum": { "chapters": 3 },
  "Habakkuk": { "chapters": 3 },
  "Zephaniah": { "chapters": 3 },
  "Haggai": { "chapters": 2 },
  "Zechariah": { "chapters": 14 },
  "Malachi": { "chapters": 4 },
  "Matthew": { "chapters": 28 },
  "Mark": { "chapters": 16 },
  "Luke": { "chapters": 24 },
  "John": { "chapters": 21 },
  "Acts": { "chapters": 28 },
  "Romans": { "chapters": 16 },
  "1 Corinthians": { "chapters": 16 },
  "2 Corinthians": { "chapters": 13 },
  "Galatians": { "chapters": 6 },
  "Ephesians": { "chapters": 6 },
  "Philippians": { "chapters": 4 },
  "Colossians": { "chapters": 4 },
  "1 Thessalonians": { "chapters": 5 },
  "2 Thessalonians": { "chapters": 3 },
  "1 Timothy": { "chapters": 6 },
  "2 Timothy": { "chapters": 4 },
  "Titus": { "chapters": 3 },
  "Philemon": { "chapters": 1 },
  "Hebrews": { "chapters": 13 },
  "James": { "chapters": 5 },
  "1 Peter": { "chapters": 5 },
  "2 Peter": { "chapters": 3 },
  "1 John": { "chapters": 5 },
  "2 John": { "chapters": 1 },
  "3 John": { "chapters": 1 },
  "Jude": { "chapters": 1 },
  "Revelation": { "chapters": 22 }
};

const { width } = Dimensions.get('window');
const chapterWidth = 35; // Adjust width for chapter boxes
const numColumns = Math.floor(width / chapterWidth); // Calculate how many boxes fit in one row

const BookListScreen: React.FC = () => {
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for the search query
  const navigation = useNavigation(); // Initialize navigation

  const handleBookPress = (bookName: string) => {
    if (expandedBook === bookName) {
      setExpandedBook(null); // Collapse the book if it is already expanded
    } else {
      setExpandedBook(bookName); // Expand the selected book
    }
  };

  // Navigate to the BibleScreen when a chapter is pressed
  const handleChapterPress = (bookName: string, chapterNumber: number) => {
    navigation.navigate('Bible', {
      book: bookName,
      chapter: chapterNumber,
    });
  };

  // Filter the books based on the search query
  const filteredBibleData = Object.keys(bibleData).filter(book =>
    book.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient colors={['#0A2647', '#273752']} style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a book"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredBibleData}
        renderItem={({ item }) => {
          const isExpanded = expandedBook === item;
          const chapters = bibleData[item].chapters;

          return (
            <View>
              <TouchableOpacity
                onPress={() => handleBookPress(item)}
                style={styles.bookContainer}
              >
                <Text style={styles.bookName}>{item}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.chapterGrid}>
                  {Array.from({ length: chapters }, (_, index) => index + 1).map((chapterNumber) => {
                    return (
                      <TouchableOpacity
                        key={chapterNumber}
                        style={styles.chapterSquare}
                        onPress={() => handleChapterPress(item, chapterNumber)} // Navigate to BibleScreen
                      >
                        <Text style={styles.chapterText}>{chapterNumber}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        }}
        keyExtractor={(item) => item}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginTop: 40, // Space at the top
    marginBottom: 20, // Space below the search bar
    width: '100%',
    alignItems: 'center', // Center the search bar horizontally
  },
  searchInput: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    alignSelf: 'center', // Align the search bar
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)', // Light border to separate from background
  },
  bookContainer: {
    padding: 10,
  },
  bookName: {
    fontSize: 18,
    color: '#FFA500',
  },
  chapterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  chapterSquare: {
    width: chapterWidth,
    height: chapterWidth,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
  highlightedChapter: {
    backgroundColor: '#32CD32', // Highlighted chapter color
  },
  chapterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default BookListScreen;
