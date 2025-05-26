// component/MessHomeHeader.tsx
import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../../../Css/mess/MessHome';
import { Add } from 'iconsax-react-native';
import color from '../../../Custom/Color';

export default function MessHomeHeader({ searchTerm, setSearchTerm, onCreateGroup }: any) {
  return (
    <View style={[styles.searchWrapper, { flexDirection: 'row', alignItems: 'center' }]}>
      <TextInput
        placeholder="Tìm kiếm"
        placeholderTextColor="#aaa"
        style={[styles.searchInput, { flex: 1 }]}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <TouchableOpacity onPress={onCreateGroup} style={{ marginLeft: 10 }}>
        <Add size={26} color={color.accentBlue} />
      </TouchableOpacity>
    </View>
  );
}
