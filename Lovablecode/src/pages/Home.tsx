import { Card, CardContent, CardHeader, Avatar, AvatarFallback, Badge } from "@/components/ui/display";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form-elements";
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp } from "lucide-react";

const Home = ({ user }: { user: any }) => {
  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.user_metadata?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your thoughts with the community..."
                    className="min-h-[100px] resize-none"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        #Discussion
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        #Question
                      </Badge>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Posts */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-muted-foreground">2 hours ago · Computer Science</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Question</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Need help understanding React hooks
                  </h3>
                  <p className="text-muted-foreground">
                    I'm struggling with useEffect dependencies. Can someone explain when I should
                    include variables in the dependency array?
                  </p>
                </div>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <Button variant="ghost" size="sm" className="gap-2 hover:text-destructive">
                    <Heart className="w-4 h-4" />
                    <span>24</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 hover:text-primary">
                    <MessageCircle className="w-4 h-4" />
                    <span>12</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Trending Topics</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Data Structures", "Machine Learning", "Web Development", "Algorithms"].map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                  <span className="font-medium">#{topic}</span>
                  <Badge variant="secondary">{Math.floor(Math.random() * 100) + 50}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <h3 className="font-semibold">Upcoming Events</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-border rounded-lg space-y-2">
                <Badge className="bg-accent">Tomorrow</Badge>
                <p className="font-medium">Study Group - Calculus II</p>
                <p className="text-sm text-muted-foreground">3:00 PM - Virtual Room A</p>
              </div>
              <div className="p-3 border border-border rounded-lg space-y-2">
                <Badge className="bg-secondary">This Week</Badge>
                <p className="font-medium">Guest Lecture: AI Ethics</p>
                <p className="text-sm text-muted-foreground">Friday 2:00 PM - Main Hall</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
