import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { getMessagesByConversation } from '../../../../../store/chatSlice';

export default function MessageSearchModal({
    conversationId,
    onClose,
    onScrollToMessage,
    setHighlightedMsgId,
}: {
    conversationId: string;
    onClose: () => void;
    onScrollToMessage: (msgId: string) => void;
    setHighlightedMsgId: (id: string) => void;
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const allMessages = useSelector((state: any) =>
        getMessagesByConversation(state, conversationId)
    );
   

    useEffect(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
            setResults([]);
            setCurrentIndex(0);
            return;
        }

        const matched = allMessages
            .filter((m: any) => m.type === 'text' && m.content?.toLowerCase().includes(q))
            .sort(
                (a: any, b: any) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

        setResults(matched);
        setCurrentIndex(0);
        if (matched.length > 0) {
            setHighlightedMsgId(matched[0]._id);
            onScrollToMessage(matched[0]._id);
        }
    }, [query]);

    const goToPrev = () => {
        if (results.length === 0) return;
        const prev = (currentIndex - 1 + results.length) % results.length;
        setCurrentIndex(prev);
        const msgId = results[prev]._id;
        setHighlightedMsgId(msgId);
        onScrollToMessage(msgId);
    };

    const goToNext = () => {
        if (results.length === 0) return;
        const next = (currentIndex + 1) % results.length;
        setCurrentIndex(next);
        const msgId = results[next]._id;
        setHighlightedMsgId(msgId);
        onScrollToMessage(msgId);
    };

    return (
        <Modal visible={true} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.searchBar}>
                    <TextInput
                        placeholder="Tìm tin nhắn..."
                        style={styles.searchInput}
                        value={query}
                        onChangeText={(text) => setQuery(text)}
                    />

                    {results.length > 0 && (
                        <View style={styles.navContainer}>
                            <TouchableOpacity onPress={goToPrev}>
                                <Image
                                    source={require('../../../../../Icon/up.png')}
                                    style={{ width: 18, height: 18, tintColor: '#fff' }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>

                            <Text style={styles.resultText}>
                                {currentIndex + 1}/{results.length}
                            </Text>

                            <TouchableOpacity onPress={goToNext}>
                                <Image
                                    source={require('../../../../../Icon/down.png')}
                                    style={{ width: 18, height: 18, tintColor: '#fff' }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeBtn}>✕</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(223, 36, 36, 0.4)',
        justifyContent: 'flex-start',
        padding: 10,

    },
    searchBar: {
        backgroundColor: '#2c3e50',
        // margin: 20,
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        width: '90%',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 14,
    },
    navContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    resultText: {
        color: '#fff',
        fontSize: 14,
    },
    closeBtn: {
        fontSize: 18,
        color: '#f00',
        marginLeft: 8,
        fontWeight: 'bold',
    },
});
