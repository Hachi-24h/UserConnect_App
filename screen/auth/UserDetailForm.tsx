import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../Css/auth/UserDetailFormCss";
import { getToken } from '../../utils/token'; 
import BASE_URL from '../../config/IpAddress';

export default function ProfileUpdateForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };



  const handleSubmit = async () => {
    const token = await getToken();
    if (!token) {
      Alert.alert('❌ Bạn chưa đăng nhập!');
      return;
    }
  
    const userDetail = {
      firstname: firstName,
      lastname: lastName,
      dob: date.toISOString(), // dạng ISO
      gender,
      phoneNumber: phone,
      email,
      address,
      bio: "This is bio demo", // bạn có thể cho người dùng nhập sau
      avatar: "",
      backgroundAvatar: ""
    };
  
    try {
      const res = await fetch(`${BASE_URL}/user-detail`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(userDetail),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        Alert.alert('🎉 Cập nhật thành công!');
        console.log('✅ Kết quả:', data);
      } else {
        Alert.alert('⚠️ Lỗi:', data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      console.error('❌ Lỗi gửi dữ liệu:', err);
      Alert.alert('❌ Không thể kết nối đến server!');
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Update Profile Information</Text>
      </View>

      <View style={styles.formContainer}>
        {/* First Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
            placeholderTextColor="#888"
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
            placeholderTextColor="#888"
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {["male", "female", "other"].map((g) => (
              <TouchableOpacity
                key={g}
                style={styles.genderOption}
                onPress={() => setGender(g)}
              >
                <View
                  style={[
                    styles.checkbox,
                    gender === g && styles.checkboxSelected,
                  ]}
                >
                  {gender === g && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.genderText}>
                  {g === "male" ? "Male" : g === "female" ? "Female" : "Other"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            placeholderTextColor="#888"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
