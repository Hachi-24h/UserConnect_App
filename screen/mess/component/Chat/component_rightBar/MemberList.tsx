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
import AddMemberModal from './AddMemberModal'; // ✅ import modal
import MemberModal from './MemberModal';

interface MemberListProps {
    members: any[];
    adminId: string;
    currentUserId: string;
    conversationId: string;
    socket: any;
}

export default function MemberList({
    members,
    adminId,
    currentUserId,
    conversationId,
    socket,
}: MemberListProps) {
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const isAdmin = currentUserId === adminId;

    const renderMember = (member: any) => {
        const isAdminMember = member.userId === adminId;
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
                    style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }}
                />
                <Text style={{ color: '#fff', fontSize: 16 }}>
                    {member.name}
                    {isAdminMember && <Text style={{ color: '#f39c12' }}> (Admin)</Text>}
                </Text>
            </View>
        );
    };

    return (
        <View style={{ marginBottom: 28 }}>
            {/* Header */}
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

                {isAdmin && (
                    <TouchableOpacity
                        onPress={() => setShowAddModal(true)}
                        style={{ padding: 6, marginRight: 6 }}
                    >
                        <UserAdd size={22} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Hiển thị 2 thành viên đầu */}
            <View>
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

            {/* Modal xem thêm */}
            <MemberModal
                showModal={showModal}
                setShowModal={setShowModal}
                members={members}
                renderMember={renderMember}
            />

            {/* ✅ Modal thêm thành viên */}
            {showAddModal && (
                <AddMemberModal
                    visible={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    members={members}
                    conversationId={conversationId}
                    socket={socket}
                />
            )}
        </View>
    );
}
