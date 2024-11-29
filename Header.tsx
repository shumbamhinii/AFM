import React, { useState, useEffect } from 'react';
import {Text,StyleSheet,View,TouchableOpacity,Modal,FlatList,TextInput, Alert,} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface Branch {
  branch_id: string;
  name: string;
  location: string;
}

interface HeaderProps {
  setSelectedBranch: (branch: Branch) => void;
}

const Header: React.FC<HeaderProps> = ({ setSelectedBranch }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const fetchBranches = async () => {
    try {
      const response = await fetch('http://192.168.100.5:7000/branches');
      if (!response.ok) {
        throw new Error(`Failed to fetch branches. Status code: ${response.status}`);
      }
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      Alert.alert('Error', 'Failed to load branches. Please try again later.');
    }
  };

  const setBranchInSession = async (branch: Branch) => {
    try {
      const response = await fetch('http://192.168.100.5:7000/select-branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ branch_id: branch.branch_id }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedBranch(branch);
        Alert.alert('Success', `Branch set to ${branch.name}`);
        setModalVisible(false);
      } else {
        const errorData = await response.json();
        console.error('Error setting branch:', errorData);
        Alert.alert('Error', errorData.error || 'Failed to set branch.');
      }
    } catch (error) {
      console.error('Error setting branch in session:', error);
      Alert.alert('Error', 'An unexpected error occurred while setting the branch.');
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const navigateToBible = () => {
      navigation.navigate('Bible'); // Navigate to the Bible screen
    };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.title}>AFM</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToBible}>
        <Icon name="bible" size={24} color="#fff" style={styles.icon} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <LinearGradient colors={['#0A2647', '#273752']} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Branches</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search branches..."
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <FlatList
              data={filteredBranches}
              keyExtractor={(item) => item.branch_id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setBranchInSession(item)}>
                  <View style={styles.branchItem}>
                    <Text style={styles.branchText}>{item.name}</Text>
                    <Text style={styles.branchText}>Location: {item.location}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 90,
    backgroundColor: '#0A2647',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 10,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    opacity: 0.9,
  },
  modalContent: {
    height: '60%',
    backgroundColor: 'transparent',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  branchItem: {
    marginBottom: 15,
  },
  branchText: {
    fontSize: 18,
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#0A2647',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;
