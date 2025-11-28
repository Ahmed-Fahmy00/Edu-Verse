import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/display";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/overlay";
import { BookOpen, Users, Clock, Plus } from "lucide-react";
import { toast } from "sonner";

const Courses = () => {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [studentEmail, setStudentEmail] = useState("");

  const [newCourse, setNewCourse] = useState({
    title: "",
    code: "",
    description: "",
    credit_hours: 3
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        checkRole(user.id);
        fetchCourses();
      }
    });
  }, []);

  const checkRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "instructor")
      .single();
    
    setIsInstructor(!!data);
    setLoading(false);
  };

  const fetchCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select(`
        *,
        profiles:instructor_id (name),
        enrollments (count)
      `)
      .order("created_at", { ascending: false });
    
    setCourses(data || []);
  };

  const createCourse = async () => {
    if (!newCourse.title || !newCourse.code) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { error } = await supabase
      .from("courses")
      .insert([{ ...newCourse, instructor_id: user?.id }]);

    if (error) {
      toast.error("Failed to create course");
    } else {
      toast.success("Course created successfully!");
      setOpen(false);
      setNewCourse({ title: "", code: "", description: "", credit_hours: 3 });
      fetchCourses();
    }
  };

  const enrollStudent = async () => {
    if (!studentEmail || !selectedCourse) {
      toast.error("Please enter student email");
      return;
    }

    const { data: userData } = await supabase
      .from("profiles")
      .select("id")
      .ilike("name", `%${studentEmail}%`)
      .single();

    if (!userData) {
      toast.error("Student not found");
      return;
    }

    const { error } = await supabase
      .from("enrollments")
      .insert([{
        course_id: selectedCourse.id,
        student_id: userData.id,
        semester: "Fall 2025"
      }]);

    if (error) {
      toast.error("Failed to enroll student");
    } else {
      toast.success("Student enrolled successfully!");
      setEnrollDialogOpen(false);
      setStudentEmail("");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background"><Navbar user={user} /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
            Courses
          </h1>
          {isInstructor && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Course Title *</Label>
                    <Input
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                      placeholder="Introduction to Computer Science"
                    />
                  </div>
                  <div>
                    <Label>Course Code *</Label>
                    <Input
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      placeholder="CS101"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                      placeholder="Course description..."
                    />
                  </div>
                  <div>
                    <Label>Credit Hours</Label>
                    <Input
                      type="number"
                      value={newCourse.credit_hours}
                      onChange={(e) => setNewCourse({ ...newCourse, credit_hours: parseInt(e.target.value) })}
                    />
                  </div>
                  <Button onClick={createCourse} className="w-full">Create Course</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="p-6 hover:shadow-[var(--shadow-card)] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                  {course.code}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {course.description || "No description available"}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrollments?.[0]?.count || 0} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.credit_hours}h</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Instructor: {course.profiles?.name || "Unknown"}
                </p>
              </div>

              {isInstructor && user?.id === course.instructor_id && (
                <Button
                  onClick={() => {
                    setSelectedCourse(course);
                    setEnrollDialogOpen(true);
                  }}
                  variant="outline"
                  className="w-full mt-4"
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
          <div className="space-y-4">
            <div>
              <Label>Student Name or Email</Label>
              <Input
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="Search by name..."
              />
            </div>
            <Button onClick={enrollStudent} className="w-full">Enroll Student</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
