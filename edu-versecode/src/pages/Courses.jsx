import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/display";
import { Input, Textarea, Label } from "../components/ui/form-elements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/overlay";
import { BookOpen, Users, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import "../styles/courses.css";
import { getSession } from "../api/session";
import { getAllCourses } from "../api/courses";

const Courses = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");

  const [newCourse, setNewCourse] = useState({
    title: "",
    code: "",
    description: "",
    credit_hours: 3,
  });

  useEffect(() => {
    const session = getSession();
    if (session && session.user) {
      setUser(session.user);
      // TODO: checkRole(session.user.id) if backend supports roles
      fetchCourses();
    }
  }, []);

  // TODO: Implement checkRole with backend if available

  const fetchCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (e) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement createCourse with backend API
  const createCourse = async () => {
    toast.error("Course creation not implemented yet.");
  };

  // TODO: Implement enrollStudent with backend API
  const enrollStudent = async () => {
    toast.error("Student enrollment not implemented yet.");
  };

  if (loading) {
    return (
      <div className="courses-page">
        <Navbar user={user} />
      </div>
    );
  }

  return (
    <div className="courses-page">
      <Navbar user={user} />
      <div className="courses-container">
        <div className="courses-header">
          <h1 className="courses-title">Courses</h1>
          {isInstructor && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <Plus className="icon mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <div className="dialog-body">
                  <div>
                    <Label>Course Title *</Label>
                    <Input
                      value={newCourse.title}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, title: e.target.value })
                      }
                      placeholder="Introduction to Computer Science"
                    />
                  </div>
                  <div>
                    <Label>Course Code *</Label>
                    <Input
                      value={newCourse.code}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, code: e.target.value })
                      }
                      placeholder="CS101"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      placeholder="Course description..."
                    />
                  </div>
                  <div>
                    <Label>Credit Hours</Label>
                    <Input
                      type="number"
                      value={newCourse.credit_hours}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          credit_hours: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <Button onClick={createCourse} className="btn-full">
                    Create Course
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <Card key={course.id} className="card course-card">
              <div className="course-header">
                <div className="course-icon">
                  <BookOpen className="icon" />
                </div>
                <span className="course-code">{course.code}</span>
              </div>

              <h3 className="course-title">{course.title}</h3>
              <p className="course-desc">
                {course.description || "No description available"}
              </p>

              <div className="course-meta">
                <div className="course-meta-item">
                  <Users className="icon" />
                  <span>{course.enrollments?.[0]?.count || 0} students</span>
                </div>
                <div className="course-meta-item">
                  <Clock className="icon" />
                  <span>{course.credit_hours}h</span>
                </div>
              </div>

              <div className="course-instructor">
                <p>Instructor: {course.profiles?.name || "Unknown"}</p>
              </div>

              {isInstructor && user?.id === course.instructor_id && (
                <Button
                  onClick={() => {
                    setSelectedCourse(course);
                    setEnrollDialogOpen(true);
                  }}
                  className="btn-outline btn-full mt-4"
                >
                  Add Student
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Student in {selectedCourse?.title}</DialogTitle>
          </DialogHeader>
          <div className="dialog-body">
            <div>
              <Label>Student Name or Email</Label>
              <Input
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Search by name..."
              />
            </div>
            <Button onClick={enrollStudent} className="btn-full">
              Enroll Student
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
