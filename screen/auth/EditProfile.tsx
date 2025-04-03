import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Switch, ScrollView } from "react-native";

import styles from "../Css/EditProfile";
import color from "../Custom/Color";
import Footer from "./Footer";

const EditProfile = ({ navigation }: any) => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [name, setName] = useState("Minh Thuận");
    const [username, setUsername] = useState("Minh Thuận");
    const [bio, setBio] = useState("UI/UX Designer | Crafting seam digital experiences | Designing user-centric interfaces");
    const [link, setLink] = useState("http://minhthuanpro.io");
    const [location, setLocation] = useState("Ho Chi Minh, Viet Nam");

    const toggleSwitch = () => setIsPrivate(previousState => !previousState);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Image source={require("../Icon/back.png")} style={styles.backIcon} />
                </TouchableOpacity>

                <Text style={styles.headerText}>Edit Profile</Text>
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container1}>
                <View style={styles.box1}></View>

                <View style={styles.profilePicContainer}>
                    <TouchableOpacity style={styles.cameraIcon}>
                        <Image source={require("../Icon/edit.png")} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: "https://picsum.photos/200/300" }}
                        style={styles.profilePic}
                    />
                </View>

                <View style={styles.box2}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={styles.textArea}
                            value={bio}
                            onChangeText={setBio}
                            multiline={true}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Link</Text>
                        <TextInput
                            style={styles.input}
                            value={link}
                            onChangeText={setLink}
                        />
                    </View>

                    <View style={styles.switchContainer}>
                        <Text style={styles.label}>Private Profile</Text>
                        <Switch
                            value={isPrivate}
                            onValueChange={toggleSwitch}
                            trackColor={{ false: color.gray, true: color.beige }}
                            thumbColor={isPrivate ? color.white : color.gray}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                        />
                    </View>
                </View>
            </ScrollView>

            <Footer navigation={navigation} />
        </View>
    );
};

export default EditProfile;
