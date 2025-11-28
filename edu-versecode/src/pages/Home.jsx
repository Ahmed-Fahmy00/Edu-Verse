import React from "react";
import { Card, CardContent, CardHeader, Avatar, AvatarFallback, Badge } from "../components/ui/display";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/form-elements";
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp } from "lucide-react";
import "../styles/home.css"; // import the CSS file

const Home = ({ user }) => {
  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const trendingTopics = ["Data Structures", "Machine Learning", "Web Development", "Algorithms"];
  const samplePosts = [1, 2, 3];

  return (
    <div className="home-container">
      <div className="home-grid">
        {/* Main Feed */}
        <div className="main-feed">
          {/* Create Post */}
          <Card className="card shadow-card">
            <CardContent className="card-content pt-6">
              <div className="create-post">
                <Avatar>
                  <AvatarFallback className="avatar-fallback-primary">
                    {getInitials(user?.user_metadata?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="create-post-body">
                  <Textarea
                    placeholder="Share your thoughts with the community..."
                    className="post-textarea"
                  />
                  <div className="post-footer">
                    <div className="badges">
                      <Badge className="badge-outline">#Discussion</Badge>
                      <Badge className="badge-outline">#Question</Badge>
                    </div>
                    <Button className="btn-primary">Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Posts */}
          {samplePosts.map((i) => (
            <Card key={i} className="card shadow-card hover-shadow">
              <CardHeader className="card-header">
                <div className="post-header">
                  <div className="post-user">
                    <Avatar>
                      <AvatarFallback className="avatar-fallback-secondary">JD</AvatarFallback>
                    </Avatar>
                    <div className="user-info">
                      <p className="user-name">John Doe</p>
                      <p className="user-meta">2 hours ago · Computer Science</p>
                    </div>
                  </div>
                  <Badge className="badge-secondary">Question</Badge>
                </div>
              </CardHeader>
              <CardContent className="card-content space-y">
                <div className="post-content">
                  <h3 className="post-title">Need help understanding React hooks</h3>
                  <p className="post-text">
                    I'm struggling with useEffect dependencies. Can someone explain when I should
                    include variables in the dependency array?
                  </p>
                </div>
                <div className="post-actions">
                  <Button className="btn-ghost gap-2 hover-destructive">
                    <Heart className="icon" />
                    <span>24</span>
                  </Button>
                  <Button className="btn-ghost gap-2 hover-primary">
                    <MessageCircle className="icon" />
                    <span>12</span>
                  </Button>
                  <Button className="btn-ghost gap-2">
                    <Share2 className="icon" />
                  </Button>
                  <Button className="btn-ghost gap-2 ml-auto">
                    <Bookmark className="icon" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Trending Topics */}
          <Card className="card shadow-card">
            <CardHeader>
              <div className="sidebar-header">
                <TrendingUp className="icon-primary" />
                <h3 className="sidebar-title">Trending Topics</h3>
              </div>
            </CardHeader>
            <CardContent className="sidebar-content">
              {trendingTopics.map((topic, i) => (
                <div key={i} className="sidebar-item">
                  <span className="topic-name">#{topic}</span>
                  <Badge className="badge-secondary">{Math.floor(Math.random() * 100) + 50}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="card shadow-card">
            <CardHeader>
              <h3 className="sidebar-title">Upcoming Events</h3>
            </CardHeader>
            <CardContent className="sidebar-content space-y">
              <div className="event-item">
                <Badge className="badge-accent">Tomorrow</Badge>
                <p className="event-title">Study Group - Calculus II</p>
                <p className="event-meta">3:00 PM - Virtual Room A</p>
              </div>
              <div className="event-item">
                <Badge className="badge-secondary">This Week</Badge>
                <p className="event-title">Guest Lecture: AI Ethics</p>
                <p className="event-meta">Friday 2:00 PM - Main Hall</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
