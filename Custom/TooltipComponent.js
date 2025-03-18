import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const TooltipComponent = ({ visible, onClose, content, position = { top: 0, left: 0 } }) => {
    if (!visible) return null; // Không hiển thị nếu `visible` là false

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={[styles.container, position]}>
                <View style={styles.tooltipBox}>
                    {typeof content === 'string' ? (
                        <Text style={styles.text}>{content}</Text>
                    ) : (
                        content
                    )}
                </View>
                <View style={styles.arrow} />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute', // Đặt tuyệt đối theo vị trí
        zIndex: 1000, // Đảm bảo Tooltip nổi lên trên
    },
    tooltipBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Nền tối mờ
        padding: 10,
        borderRadius: 5,
        maxWidth: 200, // Đặt kích thước tối đa cho tooltip
    },
    text: {
        color: '#fff', // Chữ trắng
        fontSize: 14,
    },
    arrow: {
        width: 10,
        height: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Màu trùng với tooltipBox
        position: 'absolute',
        top: -5, // Đặt phía trên tooltipBox
        left: '50%',
        marginLeft: -5,
        transform: [{ rotate: '45deg' }], // Xoay để tạo hình mũi tên
    },
});

export default TooltipComponent;
