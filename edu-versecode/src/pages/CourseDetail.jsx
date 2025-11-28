import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Card, Badge } from "../components/ui/display";
import { getCourseDetails } from "../api/courses";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [files, setFiles] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const data = await getCourseDetails(courseId);
      setCourse(data);
      setFiles(data.files || []);
      setPosts(data.posts || []);
    } catch (e) {
      setCourse(null);
      setFiles([]);
      setPosts([]);
    }
  };

  return (
    <div className="course-detail-page">
      <Navbar />
      <div className="course-detail-container">
        <Card className="course-detail-card">
          <h1 className="course-title">{course?.name || "Loading..."}</h1>
          <Badge>{course?._id}</Badge>
          <p className="course-description">{course?.description}</p>
          <p className="course-credit">Credit Hours: {course?.creditHours}</p>
        </Card>
        <div className="course-sections">
          <Card className="course-files-section">
            <h2>Files</h2>
            {files.length > 0 ? (
              files.map((file) => (
                <div key={file._id} className="file-item">
                  <span>{file.fileName}</span>
                  <Badge>{file.fileType}</Badge>
                </div>
              ))
            ) : (
              <p>No files for this course.</p>
            )}
          </Card>
          <Card className="course-posts-section">
            <h2>Posts</h2>
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post._id} className="post-item">
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <Badge>{post.type}</Badge>
                </div>
              ))
            ) : (
              <p>No posts for this course.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
