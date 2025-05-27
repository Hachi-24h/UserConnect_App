import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  SafeAreaView,
  StatusBar
} from 'react-native';


// Get the screen dimensions
const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>👁️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Profile Content */}
      <View style={styles.profileContent}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            style={styles.profileImage} 
          />
        </View>
        
        {/* Profile Info */}
        <Text style={styles.profileName}>Phan Thanh Nam</Text>
        <Text style={styles.profileSubtitle}>Tuyết</Text>
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>👤</Text>
            <Text style={styles.actionButtonText}>Cài zStyle</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>🖼️</Text>
            <Text style={styles.actionButtonText}>Ảnh của tôi</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonIcon}>📁</Text>
            <Text style={styles.actionButtonText}>Kho khoảnh</Text>
          </TouchableOpacity>
        </View>
        
        {/* Illustration */}
        <View style={styles.illustration}>
          <Text style={styles.illustrationText}>📱</Text>
        </View>
        
        {/* Question */}
        <Text style={styles.questionText}>Hôm nay Phan Thanh Nam có gì vui?</Text>
        <Text style={styles.subtitleText}>
          Đây là Nhật ký của You - Hãy làm đầy Nhật ký với những dấu ấn cuộc đời và kỷ niệm đáng nhớ nhé!
        </Text>
        
        {/* Post Button */}
        <TouchableOpacity style={styles.postButton}>
          <Text style={styles.postButtonText}>Đăng lên Nhật ký</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#333',
    height: height * 0.08,
  },
  backButton: {
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: width * 0.06,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.02,
  },
  iconText: {
    color: 'white',
    fontSize: width * 0.05,
  },
  profileContent: {
    alignItems: 'center',
    paddingTop: height * 0.02,
  },
  profileImageContainer: {
    width: width * 0.3, // 30% of screen width
    height: width * 0.3, // Keep it square
    borderRadius: width * 0.15, // Half of width to make it circular
    borderWidth: width * 0.01,
    borderColor: 'white',
    overflow: 'hidden',
    marginBottom: height * 0.02,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: width * 0.06, // 6% of screen width
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.005,
  },
  profileSubtitle: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#666',
    marginBottom: height * 0.02,
  },
  actionButtons: {
    flexDirection: 'row',
    width: width * 0.9, // 90% of screen width
    justifyContent: 'space-between',
    marginVertical: height * 0.03,
  },
  actionButton: {
    width: width * 0.28, // ~30% of screen width with spacing
    height: height * 0.06,
    backgroundColor: 'white',
    borderRadius: width * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.02,
  },
  actionButtonIcon: {
    fontSize: width * 0.05,
    marginRight: width * 0.01,
  },
  actionButtonText: {
    fontSize: width * 0.035,
    color: '#333',
  },
  illustration: {
    width: width * 0.5, // 50% of screen width
    height: height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  illustrationText: {
    fontSize: width * 0.15,
  },
  questionText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.01,
  },
  subtitleText: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
    width: width * 0.8,
    marginBottom: height * 0.03,
  },
  postButton: {
    width: width * 0.5, // 50% of screen width
    height: height * 0.06,
    backgroundColor: '#1877f2',
    borderRadius: width * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  postButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;