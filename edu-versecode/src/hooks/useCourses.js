// src/hooks/useCourses.js

import { useState, useEffect, useCallback } from 'react';
import * as coursesApi from '../api/courses';

/**
 * Custom hook to manage course state, fetching, and related actions.
 * @param {string} courseId - Optional ID of a specific course to fetch details for.
 */
const useCourses = (courseId = null) => {
    const [courses, setCourses] = useState([]);
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await coursesApi.getAllCourses();
            setCourses(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch course catalog.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCourseDetails = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const data = await coursesApi.getCourseDetails(id);
            setCourseDetails(data);
        } catch (err) {
            setError(err.message || `Failed to fetch course details for ${id}.`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails(courseId);
        } else {
            fetchAllCourses();
        }
    }, [courseId, fetchAllCourses, fetchCourseDetails]);

    // Example action: Enrollment (requires token/user context access)
    const enrollInCourse = async (code, token) => {
        try {
            await coursesApi.enrollInCourse(code, token);
            alert(`Successfully enrolled in course ${code}!`);
            return true;
        } catch (err) {
            setError(`Enrollment failed: ${err.message}`);
            return false;
        }
    };

    return {
        courses,
        courseDetails,
        loading,
        error,
        fetchAllCourses,
        fetchCourseDetails,
        enrollInCourse,
    };
};

export default useCourses;