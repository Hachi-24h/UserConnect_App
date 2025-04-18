import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../Css/auth/UserDetailFormCss";
import { createUserDetail, checkEmailExists } from "../../utils/user";
import { showNotification } from "../../Custom/notification";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function UserDetailForm({navigation}: any) {
  
  const user = useSelector((state: any) => state.user);
  const phone = user?.phoneNumber || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("");

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const isNameValid = (name: string) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
  };

  const isAtLeast15YearsOld = (dob: Date) => {
    const today = new Date();
    const minDOB = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    return dob <= minDOB;
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!firstName.trim() || !lastName.trim()) {
      showNotification("First and last name are required", "error");
      return;
    }

    if (!isNameValid(firstName) || !isNameValid(lastName)) {
      showNotification("Names cannot contain numbers or special characters", "error");
      return;
    }

    if (!isAtLeast15YearsOld(date)) {
      showNotification("You must be at least 15 years old", "error");
      return;
    }

    if(!email.trim()) {
      showNotification("Email is required", "error");
      return;
    }

    if (email) {
      const exists = await checkEmailExists(email);
      if (exists) {
        showNotification("This email is already in use", "error");
        return;
      }
    }

    const payload = {
      firstname: firstName.trim().toLocaleLowerCase(),
      lastname: lastName.trim().toLocaleLowerCase(),
      dob: date.toISOString(),
      gender: gender || "other",
      phoneNumber: phone,
      email: email || undefined,
      bio: "This is a default bio",
      avatar: "",
      backgroundAvatar: "",
    };

    try {
      const res = await createUserDetail(payload);
      showNotification("🎉 Profile updated successfully!", "success");
      navigation.navigate("MessHome");
    } catch (err: any) {
      showNotification(
        err?.response?.data?.message || "Failed to update profile",
        "error"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Update Your Profile</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Phone Number - disabled */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#ccc" }]}
            value={phone}
            editable={false}
            placeholderTextColor="#888"
          />
        </View>

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

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
