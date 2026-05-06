import axios from 'axios';

// Add /api to the end of your baseURL
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add token to headers for protected routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Achievement CRUD
export const postAchievement = (data) => API.post('/posts/achievement', data);
export const deleteAchievement = (userId, postId) => API.delete(`/posts/${userId}/${postId}`);
export const updateAchievement = (userId, postId, data) => API.put(`/posts/${userId}/${postId}`, data);

// User Profile
export const fetchProfile = (username) => API.get(`/users/profile/${username}`);
export const loginUser = (formData) => API.post('/users/login', formData);
export const registerUser = (formData) => API.post('/users/register', formData);
export const updateLinks = (data) => API.put(`/users/update-links/${data.userId}`, data);
export const followUser = (id, currentUserId) => API.put(`/users/follow/${id}`, { currentUserId });
export const updateSkills = (userId, skills) => API.put(`/users/update-skills/${userId}`, { skills });
// ... existing User Profile exports

// Messaging Services
// 1. Get or create a conversation between two users
export const getOrCreateConversation = (senderId, receiverId) => 
  API.post('/messages/conversation', { senderId, receiverId });

// 2. Send a new message
export const sendMessage = (messageData) => 
  API.post('/messages', messageData);

// 3. Fetch chat history for a specific conversation
export const fetchMessages = (conversationId) => 
  API.get(`/messages/${conversationId}`);

// 4. Fetch all conversations for the user's inbox
export const fetchInbox = (userId) => 
  API.get(`/messages/inbox/${userId}`);

// 5. Fetch a specific user by ID
export const fetchUserById = (userId) => 
  API.get(`/users/id/${userId}`);

export default API;