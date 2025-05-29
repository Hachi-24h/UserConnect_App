// Import các thư viện cần thiết
import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { RTCView, mediaDevices, RTCPeerConnection, MediaStream, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import { Microphone, Video, CallSlash } from 'iconsax-react-native';
import type { StackScreenProps } from '@react-navigation/stack';

// Định nghĩa kiểu param cho stack navigator của bạn
type RootStackParamList = {
    VideoCall: {
        currentUserId: string;
        otherUserId: string;
        socketCall: any;
    };
    // Các screen khác nếu có...
};

// Khai báo kiểu props cho screen VideoCall, dựa vào stack param
type VideoCallScreenProps = StackScreenProps<RootStackParamList, 'VideoCall'>;

// Cấu hình ICE server
const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function VideoCallScreen({ route, navigation }: VideoCallScreenProps) {
    // Lấy params từ route
    const { currentUserId, otherUserId, socketCall } = route.params;

    // State giữ local stream và remote stream
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    // State bật tắt mic và camera
    const [micEnabled, setMicEnabled] = useState(true);
    const [camEnabled, setCamEnabled] = useState(true);

    // RTCPeerConnection dùng ref để giữ persistent object
    const pc = useRef(new RTCPeerConnection(configuration));

    useEffect(() => {
        // Hàm lấy stream media từ camera, mic local
        const getLocalStream = async () => {
            try {
                const stream = await mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                });
                setLocalStream(stream);

                // Thêm các track local stream vào peer connection
                stream.getTracks().forEach(track => {
                    pc.current.addTrack(track, stream);
                });
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        getLocalStream();

        // Khi có track remote, set stream remote
        // Ép kiểu peer connection để dùng ontrack
        (pc.current as any).ontrack = (event: any) => {
            if (event.streams && event.streams[0]) {
                setRemoteStream(event.streams[0]);
            }
        };


        // Khi có ICE candidate mới, gửi qua socket signaling
        (pc.current as any).onicecandidate = (event: any) => {
            if (event.candidate) {
                socketCall.emit('iceCandidate', { candidate: event.candidate, toUserId: otherUserId });
            }
        };



        // Lắng nghe ICE candidate nhận từ đối phương
        socketCall.on('iceCandidate', ({ candidate }: { candidate: RTCIceCandidate }) => {
            pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        });

        // Xử lý signaling offer (người nhận)
        socketCall.on('offer', async ({ sdp }: { sdp: RTCSessionDescription }) => {
            try {
                await pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                socketCall.emit('answer', { sdp: answer, toUserId: otherUserId });
            } catch (err) {
                console.error('Error handling offer:', err);
            }
        });

        // Xử lý signaling answer (người gọi)
        socketCall.on('answer', async ({ sdp }: { sdp: RTCSessionDescription }) => {
            try {
                await pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
            } catch (err) {
                console.error('Error handling answer:', err);
            }
        });

        // Nếu là người gọi, tạo offer và gửi đi
        const startCall = async () => {
            try {
                const offer = await pc.current.createOffer({});
                await pc.current.setLocalDescription(offer);
                socketCall.emit('offer', { sdp: offer, toUserId: otherUserId });
            } catch (err) {
                console.error('Error starting call:', err);
            }
        };

        startCall();

        // Cleanup khi component unmount
        return () => {
            localStream?.getTracks().forEach(track => track.stop());
            remoteStream?.getTracks().forEach(track => track.stop());
            pc.current.close();

            socketCall.off('iceCandidate');
            socketCall.off('offer');
            socketCall.off('answer');
        };

    }, []);

    // Hàm toggle mic
    const toggleMic = () => {
        if (!localStream) return;
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !micEnabled;
        });
        setMicEnabled(!micEnabled);
    };

    // Hàm toggle camera
    const toggleCam = () => {
        if (!localStream) return;
        localStream.getVideoTracks().forEach(track => {
            track.enabled = !camEnabled;
        });
        setCamEnabled(!camEnabled);
    };

    // Hàm kết thúc cuộc gọi
    const endCall = () => {
        socketCall.emit('endCall', { toUserId: otherUserId });

        // Dừng track camera, mic để tắt hẳn thiết bị
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        navigation.goBack();
    };


    return (
        <View style={styles.container}>
            {localStream && (
                <RTCView
                    streamURL={localStream.toURL()}
                    style={[styles.localVideo, !camEnabled && { opacity: 0.3 }]}
                    objectFit="cover"
                    mirror={true}
                />
            )}
            {remoteStream && (
                <RTCView
                    streamURL={remoteStream.toURL()}
                    style={styles.remoteVideo}
                    objectFit="cover"
                />
            )}
            <View style={styles.controls}>
                <TouchableOpacity onPress={toggleMic}>
                    <Microphone color={micEnabled ? 'green' : 'red'} size={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleCam}>
                    <Video color={camEnabled ? 'green' : 'red'} size={32} />
                </TouchableOpacity>
                <TouchableOpacity onPress={endCall}>
                    <CallSlash color="red" size={32} />
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    localVideo: { width: 120, height: 160, position: 'absolute', top: 20, right: 20, zIndex: 10 },
    remoteVideo: { flex: 1 },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 50,
    },
});
