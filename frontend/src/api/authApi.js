import axios from "axios";

export const loginApi = async (formData) => {
try {
     const res = await axios.post(
    "http://localhost:3001/api/v1/user/login",
    formData,
    { withCredentials: true },
  );
  return res;
} catch (error) {
    return error
}
 
};

export const getMeApi = async () => {
 try {
     const res = await axios.get("http://localhost:3001/api/v1/user/me", {
    withCredentials: true,
  });
  return res;
 } catch (error) {
    return error
 }
};
