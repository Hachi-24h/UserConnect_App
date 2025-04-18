import axios from "axios";
import BASE_URL from "../config/IpAddress";
// uri: local file path từ `react-native-image-picker`
export const uploadImage = async (uri: string): Promise<string> => {
  const fileName = uri.split("/").pop();
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: fileName || "photo.jpg",
    type: "image/jpeg",
  } as any);
  const link = `${BASE_URL}:5002/users/upload`;
  console.log("link", link); // ==> Đã là link Cloudinary
  const response = await axios.post(link, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.url; // URL từ Cloudinary
};
