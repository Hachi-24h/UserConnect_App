import React from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import Spinner from 'react-native-spinkit';

const { width } = Dimensions.get('window');

const LoadModal = ({ visible }: { visible: boolean }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Spinner
          isVisible={true}
          size={width * 0.15}
          type="ThreeBounce"
          color="#00FF99"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadModal;
