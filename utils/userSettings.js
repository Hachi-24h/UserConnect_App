import RNFS from 'react-native-fs';

// Đường dẫn file userSetting.json trong thư mục ứng dụng
const userSettingsFilePath = `${RNFS.DocumentDirectoryPath}/userSetting.json`;
// Đọc dữ liệu từ file userSetting.json
export const getUserSettings = async () => {
    try {
        const fileExists = await RNFS.exists(userSettingsFilePath);
        if (!fileExists) {
            console.log('User settings file does not exist. Returning default settings.');
            return {
                hasLoggedInBefore: false, // Giá trị mặc định
                name: '',
                nickname: '',
                systemMode: 'medium', // Mặc định là medium
            };
        }

        const fileData = await RNFS.readFile(userSettingsFilePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error('Error reading user settings:', error);
        return null;
    }
};
// Lưu dữ liệu vào file userSetting.json
export const saveUserSettings = async (settings) => {
    try {
        await RNFS.writeFile(userSettingsFilePath, JSON.stringify(settings), 'utf8');
        console.log(`User settings saved successfully at ${userSettingsFilePath}`);
    } catch (error) {
        console.error('Error saving user settings:', error);
    }
};
// Cập nhật dữ liệu trong file userSetting.json
export const updateUserSettings = async (newSettings) => {
    try {
        const currentSettings = await getUserSettings();

        const updatedSettings = {
            ...currentSettings,
            ...newSettings, // Gộp các thay đổi vào settings hiện tại
        };

        await saveUserSettings(updatedSettings);
        console.log('User settings updated successfully.');
        return true;
    } catch (error) {
        console.error('Error updating user settings:', error);
        return false;
    }
};
