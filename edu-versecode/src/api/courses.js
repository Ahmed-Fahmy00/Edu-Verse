import axios from 'axios';

const API_BASE_URL = '/api/v1/courses';

export const getAllCourses = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data; // Should contain a list of all courses
  } catch (error) {
    throw error.response.data.message || 'Failed to fetch courses';
  }
};

export const getCourseDetails = async (courseCode) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${courseCode}`);
    return response.data; // Should contain course details, posts, etc.
  } catch (error) {
    throw error.response.data.message || 'Failed to fetch course details';
  }
};

export const enrollInCourse = async (courseCode, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${courseCode}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Confirmation message/data
  } catch (error) {
    throw error.response.data.message || 'Failed to enroll in course';
  }
};
