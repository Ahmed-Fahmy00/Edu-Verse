import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Card, Badge, Avatar, AvatarFallback } from "../components/ui/display";
import { BookOpen, Award, User } from "lucide-react";
import "../styles/profile.css";
import { getSession } from "../api/session";
import { getUserProfile } from "../api/users";
import { getAllCourses } from "../api/courses";
import { getUserPosts } from "../api/posts";
import EditProfileForm from "../components/EditProfileForm";
import { useState as useModalState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [posts, setPosts] = useState([]);
  const [role, setRole] = useState("student");
  const [showEdit, setShowEdit] = useModalState(false);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      fetchProfile(session._id);
      fetchUserPosts(session._id);
    }
  }, []);

  useEffect(() => {
    if (
      profile &&
      Array.isArray(profile.courses) &&
      profile.courses.length > 0
    ) {
      fetchCourses(profile.courses);
    } else {
      setUserCourses([]);
    }
  }, [profile]);

  const fetchProfile = async (userId) => {
    try {
      const data = await getUserProfile(userId);
      setProfile(data);
      setRole(data.role || "student");
    } catch (e) {
      setProfile(null);
    }
  };

  const fetchCourses = async (userCourseIds) => {
    try {
      const allCourses = await getAllCourses();
      setCourses(allCourses);
      setUserCourses(allCourses.filter((c) => userCourseIds.includes(c._id)));
    } catch (e) {
      setCourses([]);
      setUserCourses([]);
    }
  };

  const fetchUserPosts = async (userId) => {
    try {
      const data = await getUserPosts(userId);
      setPosts(data);
    } catch (e) {
      setPosts([]);
    }
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  return (
    <div className="profile-page">
      <Navbar user={user} />
      <div className="profile-container">
        <div className="profile-main">
          <Card className="card p-8 mb-6">
            <div className="profile-header">
              <Avatar className="avatar-large">
                <AvatarFallback className="avatar-fallback-primary">
                  {profile && profile.name ? (
                    getInitials(profile.name)
                  ) : (
                    <User className="user-icon" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="profile-info">
                <h1 className="profile-name">
                  {profile && profile.name
                    ? profile.name
                    : user && user.name
                    ? user.name
                    : "Loading..."}
                </h1>
                <p className="profile-email">
                  {profile && profile.email
                    ? profile.email
                    : user && user.email
                    ? user.email
                    : ""}
                </p>
                <Badge className="badge-secondary mb-4 capitalize">
                  {role}
                </Badge>
                <p className="profile-bio">{profile?.bio || "No bio yet"}</p>
                <button
                  className="edit-profile-btn"
                  onClick={() => setShowEdit(true)}
                >
                  Edit Profile
                </button>
                {showEdit && (
                  <div className="edit-profile-modal">
                    <EditProfileForm
                      profile={profile || user}
                      onClose={() => setShowEdit(false)}
                      onUpdate={fetchProfile}
                    />
                  </div>
                )}
                <div className="profile-stats-grid">
                  <div className="stat-card stat-courses">
                    <div className="stat-icon-wrapper courses-icon">
                      <BookOpen className="stat-icon" />
                    </div>
                    <div>
                      <p className="stat-label">Courses</p>
                      <p className="stat-value">
                        {userCourses.length > 0
                          ? userCourses.length
                          : profile && profile.courses
                          ? profile.courses.length
                          : user && user.courses
                          ? user.courses.length
                          : 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="profile-lists-grid">
            <Card className="card p-6">
              <div className="section-header">
                <Award className="section-icon" />
                <h2 className="section-title">Posts</h2>
              </div>
              <div className="section-content">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post._id} className="achievement-item">
                      <div className="achievement-info">
                        <p className="achievement-name">{post.title}</p>
                        <p className="achievement-desc">{post.body}</p>
                      </div>
                      <div className="achievement-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">No posts yet</p>
                )}
              </div>
            </Card>

            <Card className="card p-6">
              <div className="section-header">
                <BookOpen className="section-icon" />
                <h2 className="section-title">Enrolled Courses</h2>
              </div>
              <div className="section-content">
                {(userCourses.length > 0
                  ? userCourses
                  : profile && profile.courses && profile.courses.length > 0
                  ? profile.courses.map((cid) => ({
                      _id: cid,
                      name: cid,
                      description: "",
                    }))
                  : user && user.courses && user.courses.length > 0
                  ? user.courses.map((cid) => ({
                      _id: cid,
                      name: cid,
                      description: "",
                    }))
                  : []
                ).map((course) => (
                  <div key={course._id} className="course-item">
                    <div className="course-header">
                      <p className="course-title">
                        {course.name || course._id}
                      </p>
                      <Badge className="badge-outline">{course._id}</Badge>
                    </div>
                    <div className="course-meta">
                      <span className="semester-text">
                        {course.description}
                      </span>
                    </div>
                  </div>
                ))}
                {!(
                  userCourses.length > 0 ||
                  (profile && profile.courses && profile.courses.length > 0) ||
                  (user && user.courses && user.courses.length > 0)
                ) && <p className="empty-text">No courses enrolled yet</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
