import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Dimensions, StyleSheet, Modal, FlatList, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SearchNormal } from 'iconsax-react-native';
import color from '../Custom/Color';
import styles from '../Css/MessHome';
const { height, width } = Dimensions.get('window');

// Định nghĩa kiểu dữ liệu cho mỗi người dùng
interface User {
    id: string;
    username: string;
    userId: string;
    time: string;
    lastMessage: string;
    avatar: string;
}

const MessHomeScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>('For you');

    // Dữ liệu người dùng
    const data: User[] = [
        { id: '1', username: 'Sin', userId: 'sin01', time: '1m', lastMessage: 'Test content', avatar: 'https://picsum.photos/id/237/200/300' },
        { id: '2', username: 'Roanldo', userId: 'ronaldo02', time: '10m', lastMessage: 'Test content', avatar: 'https://picsum.photos/id/237/200/300' },
        { id: '3', username: 'Messi', userId: 'messi03', time: '15m', lastMessage: 'Test content', avatar: 'https://picsum.photos/id/237/200/300' },
        { id: '4', username: 'Neymar', userId: 'neymar04', time: '20m', lastMessage: 'Test content', avatar: 'https://picsum.photos/id/237/200/300' },
        { id: '5', username: 'Mbappe', userId: 'mbappe05', time: '25m', lastMessage: 'Test content', avatar: 'https://picsum.photos/id/237/200/300' },
        { id: '6', username: 'Ronaldo', userId: 'ronaldo06', time: '30m', lastMessage: 'Test content', avatar: 'https://picsum.photos/id/237/200/300' },
        { id: '7', username: 'Pele', userId: 'pele07', time: '35m', lastMessage: 'Test content', avatar: 'https://picsum.photos/id/237/200/300' },
        { id: '8', username: 'Maradona', userId: 'maradona08', time: '40m', lastMessage: 'Test content', avatar: 'https://picsum.photos/id/237/200/300' },
    ];

    // Hàm xử lý tìm kiếm và lọc dữ liệu người dùng
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredData([]); // Đặt lại kết quả nếu ô tìm kiếm trống
            setModalVisible(false); // Ẩn modal nếu không có kết quả
        } else {
            const results = data.filter(item =>
                item.username.toLowerCase().includes(query.toLowerCase()) // Tìm kiếm người dùng theo tên
            );
            setFilteredData(results);
            setModalVisible(true); // Hiển thị modal khi có kết quả tìm kiếm
        }
    };

    // Render item trong danh sách FlatList
    const renderItem = ({ item }: { item: User }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.textContainer}>
                <View style={{flexDirection:"row", marginBottom:10,}}>
                     <Text style={styles.username}>{item.username}</Text>
                       <Text style={styles.time}>{item.time}</Text>
                </View>
               
                <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>
        </View>
    );
    const renderItem1 = ({ item }: { item: User }) => (
        <TouchableOpacity
            style={styles.resultItemSearch}
            onPress={() => { navigation.navigate('SignUp'); }}    >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.avatar }} style={styles.avatarSearch} />
                <Text style={styles.resultTextSearch}>{item.username}</Text>

            </View>


        </TouchableOpacity>
    );
    return (
        <LinearGradient colors={["#3D5167", "#999999"]} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearch} // Sử dụng hàm handleSearch để tìm kiếm
                    placeholder="Tìm kiếm..."
                    placeholderTextColor="white"
                />
                <TouchableOpacity style={styles.searchIcon}>
                    <SearchNormal size={20} color="gray" />
                </TouchableOpacity>
                {searchQuery.length > 0
                    && (
                        <TouchableOpacity style={styles.searchIconClear} onPress={() => {
                            setSearchQuery(''); // Đặt lại ô tìm kiếm
                            setFilteredData([]); // Đặt lại kết quả tìm kiếm
                            setModalVisible(false); // Ẩn modal
                            Keyboard.dismiss(); // Ẩn bàn phím
                        }
                        }>
                            <Image
                                source={require('../Icon/clear.png')}
                                style={{ width: 30, height: 30, tintColor: 'white' }}
                            />
                        </TouchableOpacity>
                    )}
            </View>
            {/* Modal hiển thị kết quả tìm kiếm */}
            {filteredData.length > 0 && (

                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem1}
                    style={styles.resultList}
                />
            )}

            {/* Tab "For you" và "Following" */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'For you' && [styles.selectedTab,{borderBottomRightRadius: 20, borderTopRightRadius: 20}]]} // Thêm style động khi tab được chọn
                    onPress={() => setSelectedTab('For you')} 
                >
                    <Text style={[styles.tabText, selectedTab === 'For you' && styles.selectedText]}>For you</Text>
                </TouchableOpacity>
                <TouchableOpacity  //
                    style={[styles.tabButton, selectedTab === 'Following' && [styles.selectedTab,{borderBottomLeftRadius: 20, borderTopLeftRadius: 20}]]}
                    onPress={() => setSelectedTab('Following')} // Chuyển tab khi nhấn
                >
                    <Text style={[styles.tabText, selectedTab === 'Following' && styles.selectedText]}>Following</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.line} />
            {/* Body (Danh sách các tin nhắn) */}
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
            />


        </LinearGradient>
    );
};



export default MessHomeScreen;
