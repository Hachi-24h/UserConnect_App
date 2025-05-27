import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { ArrowDown2, UserAdd } from 'iconsax-react-native';
import color from '../../../../../Custom/Color';

export default function MemberList({ members, adminId }: { members: any[]; adminId: string }) {
    const [showModal, setShowModal] = useState(false);

    const handleAddMember = () => {
        console.log("🟢 Thêm thành viên vào nhóm");
    };

    const renderMember = (member: any) => {
        const isAdmin = member.userId === adminId;

        return (
            <View
                key={member.userId}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 14,

                }}
            >
                <Image
                    source={{ uri: member.avatar }}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        marginRight: 12,
                    }}
                />
                <Text style={{ color: '#fff', fontSize: 16 }}>
                    {member.name}
                    {isAdmin && <Text style={{ color: '#f39c12' }}> (Admin)</Text>}
                </Text>
            </View>
        );
    };

    return (
        <View style={{
            marginBottom: 28,

        }}>
            {/* Header + Add icon */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                }}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}>
                    Members ({members.length})
                </Text>
                <TouchableOpacity
                    onPress={handleAddMember}
                    style={{ padding: 6, marginRight: 6 }}
                >
                    <UserAdd size={22} color="#fff" />
                </TouchableOpacity>
            </View>
            <View >
                {/* Hiển thị 2 thành viên đầu */}
                {members.slice(0, 2).map((m) => renderMember(m))}
            </View>


            {/* Nút xem thêm nếu > 2 */}
            {members.length > 2 && (

                <View style={{ alignItems: 'center', marginTop: 6 }}>
                    <TouchableOpacity onPress={() => setShowModal(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: '#00aced', fontSize: 15, marginRight: 4 }}>More</Text>
                        <ArrowDown2 size={14} color="#00aced" />
                    </TouchableOpacity>
                </View>

            )}

            {/* Modal popup */}
            <Modal visible={showModal} animationType="fade" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View
                                style={{
                                    width: '85%',
                                    maxHeight: '70%',
                                    backgroundColor: '#222',
                                    borderRadius: 12,
                                    padding: 20,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                        marginBottom: 18,
                                    }}
                                >
                                    Tất cả thành viên
                                </Text>

                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {members.map((m) => renderMember(m))}
                                </ScrollView>

                                <TouchableOpacity
                                    onPress={() => setShowModal(false)}
                                    style={{ marginTop: 20, alignSelf: 'flex-end' }}
                                >
                                    <Text style={{ color: '#00aced', fontSize: 16 }}>Đóng</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
