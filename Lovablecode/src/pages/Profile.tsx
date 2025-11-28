import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Card, Badge, Avatar, AvatarFallback } from "@/components/ui/display";
import { BookOpen, Award, Calendar, GraduationCap, User } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [role, setRole] = useState<string>("student");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchProfile(user.id);
        fetchBadges(user.id);
        fetchEnrollments(user.id);
        fetchRole(user.id);
      }
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    setProfile(data);
  };

  const fetchBadges = async (userId: string) => {
    const { data } = await supabase
      .from("user_badges")
      .select(`
        *,
        badges (*)
      `)
      .eq("user_id", userId);
    
    setBadges(data || []);
  };

  const fetchEnrollments = async (userId: string) => {
    const { data } = await supabase
      .from("enrollments")
      .select(`
        *,
        courses (title, code)
      `)
      .eq("student_id", userId);
    
    setEnrollments(data || []);
  };

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    
    if (data) setRole(data.role);
  };

  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile ? getInitials(profile.name) : <User className="w-12 h-12" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{profile?.name || "Loading..."}</h1>
                <Badge variant="secondary" className="mb-4 capitalize">{role}</Badge>
                
                <p className="text-muted-foreground mb-4">
                  {profile?.bio || "No bio yet"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">GPA</p>
                      <p className="text-2xl font-bold">{profile?.gpa?.toFixed(2) || "0.00"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary/10">
                      <BookOpen className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Courses</p>
                      <p className="text-2xl font-bold">{enrollments.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/10">
                      <Award className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Badges</p>
                      <p className="text-2xl font-bold">{badges.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Achievements</h2>
              </div>
              <div className="space-y-3">
                {badges.length > 0 ? (
                  badges.map((userBadge) => (
                    <div key={userBadge.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <span className="text-3xl">{userBadge.badges.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{userBadge.badges.name}</p>
                        <p className="text-sm text-muted-foreground">{userBadge.badges.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(userBadge.awarded_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No badges earned yet</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Enrolled Courses</h2>
              </div>
              <div className="space-y-3">
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{enrollment.courses.title}</p>
                        <Badge variant="outline">{enrollment.courses.code}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{enrollment.semester}</span>
                        {enrollment.grade && (
                          <span className="font-semibold text-primary">Grade: {enrollment.grade}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No courses enrolled yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
