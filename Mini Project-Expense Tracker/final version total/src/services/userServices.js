import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const base_url = `${API_BASE}/users/`;
const auth_url = `${API_BASE}/`;
function generateRandomId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  // "lhk8p9m2x4k"
}

const getAllUsers=async ()=>{
    const res=await axios.get(base_url)
    return res.data
}
const getUserById= async  (id)=> {
  return axios.get(base_url + id);
}

// 3. Create
const  createUser=async (data)=> {
    let result={id:generateRandomId(),...data}
  return axios.post(base_url, result);
}

// 4. Update
const  updateUserDetails=async (data)=>{
  return axios.put(base_url + data.id, data);
}

//have to add forget passsword functionality as well 
const deleteExistingUserAccount=async (id)=> {
  //  alert(id + " from service");
  return axios.delete(base_url + id);
}
const loginUser = async (data) => {
return axios.post(auth_url +"login", data);
}
const registerUser=  async (data) => {
return axios.post(auth_url +"register", data);
}
export const userService={
getUserById,
createUser,
updateUserDetails,
deleteExistingUserAccount,
getAllUsers,
loginUser,
registerUser
};

