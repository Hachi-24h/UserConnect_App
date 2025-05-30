import { ArrowLeft2, Eye, More } from 'iconsax-react-native';
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from '../../Css/InfoUser';
import color from '../../Custom/Color';
import Footer from '../other/Footer';

const { width } = Dimensions.get('window');

const InfoUser = ({ navigation }: any) => {
  // Fix the Redux selector to access userDetail.info like in info2.tsx
  const userDetail = useSelector((state: any) => state.userDetail.info);

  // Use proper fallback values from Redux data
  const avatar =
    userDetail?.avatar ||
    'https://i.postimg.cc/6pXNwv51/backgrond-mac-dinh.jpg';
  const backgroundAvatar =
    userDetail?.backgroundAvatar || 'https://picsum.photos/200/300';
  const firstname = userDetail?.firstname || '';
  const lastname = userDetail?.lastname || '';
  const bio = userDetail?.bio || '';

  // Create full name for display
  const fullName = `${firstname} ${lastname}`.trim() || 'User';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Cover photo and icons */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: backgroundAvatar }} style={styles.coverPhoto} />
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}>
            <ArrowLeft2 size={24} color={color.white} />
          </TouchableOpacity>
          <View style={styles.topRightIcons}>
            <TouchableOpacity>
              <Eye size={22} color={color.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: width * 0.03 }}
              onPress={() => navigation.navigate('SettingUser')}>
              <More size={22} color={color.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Round avatar */}
        <Image source={{ uri: avatar }} style={styles.avatar} />

        {/* User information */}
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.subText}>{bio}</Text>

        {/* Other sections, e.g., action buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require('../../Icon/idear.png')}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Set zStyle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require('../../Icon/image.png')}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>My Photos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Image
              source={require('../../Icon/post.png')}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Moments Collection</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Journal Suggestion */}
        <View style={styles.card}>
          <Image
            source={require('../../Picture/wellcome.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>
            What's fun today, {firstname || lastname}?
          </Text>
          <Text style={styles.cardText}>
            This is your Journal - Fill it with life's impressions and memorable
            moments!
          </Text>
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Post to Journal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer navigation={navigation} />
    </View>
  );
};

export default InfoUser;
