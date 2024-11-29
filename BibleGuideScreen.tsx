import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

type BibleGuideScreenProps = {
  navigation: NavigationProp<any>;
};

const bibleGuideContent = {
  oldTestament: `...`, // Keep your existing content here
  newTestament: `...`,
  allVerses: `...`,
};

const cardsData = [
  { id: '1', title: 'Card 1', content: 'Content for Card 1' },
  { id: '2', title: 'Card 2', content: 'Content for Card 2' },
  { id: '3', title: 'Card 3', content: 'Content for Card 3' },
  { id: '4', title: 'Card 4', content: 'Content for Card 4' },
];

const guideCardsData = Array.from({ length: 12 }, (_, index) => ({
  id: (index + 1).toString(),
  title: `Guide ${index + 1}`,
  content: `This is the content for guide ${index + 1}.`,
}));

const groupCards = (data: typeof guideCardsData) => {
  const grouped = [];
  for (let i = 0; i < data.length; i += 2) {
    grouped.push(data.slice(i, i + 2));
  }
  return grouped;
};

const Card = ({ title, content }: { title: string; content: string }) => {
  return (
    <LinearGradient
      colors={['#0A2647', '#3F586B']} // Example gradient colors
      style={styles.card}
    >
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardContent}>{content}</Text>
    </LinearGradient>
  );
};

const GuideRow = ({ items }: { items: typeof guideCardsData }) => {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <GuideCard key={item.id} title={item.title} content={item.content} />
      ))}
    </View>
  );
};

const GuideCard = ({ title, content }: { title: string; content: string }) => {
  return (
    <LinearGradient
      colors={['#0A2647', '#3F586B']} // Example gradient colors
      style={styles.guideCard}
    >
      <Text style={styles.guideCardTitle}>{title}</Text>
      <Text style={styles.guideCardContent}>{content}</Text>
    </LinearGradient>
  );
};

const Button = ({ onPress, title }: { onPress: () => void; title: string }) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    accessibilityLabel={`Select ${title} verses`}
    accessible
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const BibleGuideScreen = ({ navigation }: BibleGuideScreenProps) => {
  const [selectedContent, setSelectedContent] = React.useState(bibleGuideContent.allVerses);

  const handleButtonPress = (content: string) => {
    setSelectedContent(content);
  };

  const groupedGuideCards = groupCards(guideCardsData);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Bible Guide</Text>

        {/* Button Container */}
        <View style={styles.buttonContainer}>
          <Button onPress={() => handleButtonPress(bibleGuideContent.oldTestament)} title="Old Testament" />
          <Button onPress={() => handleButtonPress(bibleGuideContent.newTestament)} title="New Testament" />
          <Button onPress={() => handleButtonPress(bibleGuideContent.allVerses)} title="All Verses" />
        </View>

        {/* Horizontal Cards */}
        <FlatList
          data={cardsData}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Card title={item.title} content={item.content} />}
          contentContainerStyle={styles.cardContainer}
        />

        {/* Vertical Guide Cards */}
        <Text style={styles.guideTitle}>More Guides</Text>
        <ScrollView contentContainerStyle={styles.guideCardContainer}>
          {groupedGuideCards.map((row, index) => (
            <GuideRow key={index} items={row} />
          ))}
        </ScrollView>

        <Text style={styles.guideContent}>{selectedContent}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2647',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FFA500',
  },
  buttonText: {
    fontSize: 14,
    color: '#FFA500',
  },
  cardContainer: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    width: 300,
    height: 150,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // Change text color to white for better contrast
  },
  cardContent: {
    fontSize: 14,
    marginTop: 5,
    color: '#FFF', // Change text color to white for better contrast
  },
  guideContent: {
    fontSize: 18,
    color: '#FFF',
    lineHeight: 28,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  guideCardContainer: {
    marginBottom: 20,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  guideCard: {
    borderRadius: 20,
    padding: 15,
    margin: 5,
    width: 150,
    height: 150,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  guideCardContent: {
    fontSize: 14,
    color: '#FFF',
  },
});

export default BibleGuideScreen;
