import { useState, useEffect, useRef } from "react";
import { getSession } from "../api/session";
import { getGroupsForUser, createGroup as createGroupApi } from "../api/groups";
import { getMessagesForGroup, sendMessageToGroup } from "../api/messages";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card, Avatar, AvatarFallback } from "../components/ui/display";
import { Input, Label } from "../components/ui/form-elements";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/overlay";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Send,
  Plus,
  Users,
  Paperclip,
  Mic,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import "../styles/chats.css";

const Chats = () => {
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const sessionUser = getSession();
    setUser(sessionUser);
    if (sessionUser) fetchGroups(sessionUser._id, sessionUser.token);
  }, []);

  useEffect(() => {
    if (selectedGroup && user) {
      fetchMessages(selectedGroup._id, user.token);
    }
  }, [selectedGroup, user]);

  useEffect(() => scrollToBottom(), [messages]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchGroups = async (userId, token) => {
    try {
      const data = await getGroupsForUser(userId, token);
      setGroups(data);
    } catch (err) {
      toast.error("Failed to fetch groups");
    }
  };

  const fetchMessages = async (groupId, token) => {
    try {
      const data = await getMessagesForGroup(groupId, token);
      setMessages(data);
    } catch (err) {
      toast.error("Failed to fetch messages");
    }
  };

  const createGroup = async () => {
    if (!newGroupName) return toast.error("Please enter a group name");
    try {
      await createGroupApi(
        { name: newGroupName, created_by: user._id },
        user.token
      );
      toast.success("Group created!");
      setCreateGroupOpen(false);
      setNewGroupName("");
      fetchGroups(user._id, user.token);
    } catch (err) {
      toast.error("Failed to create group");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;
    try {
      await sendMessageToGroup(
        selectedGroup._id,
        { senderId: user._id, content: newMessage },
        user.token
      );
      setNewMessage("");
      fetchMessages(selectedGroup._id, user.token);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div className="chats-page">
      <Navbar user={user} />
      <div className="chats-container">
        <div className="chats-grid">
          {/* Groups List */}
          <Card className="groups-panel">
            <div className="groups-header">
              <h2>Chats</h2>
              <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Plus className="icon" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                  </DialogHeader>
                  <div className="dialog-body">
                    <div>
                      <Label>Group Name</Label>
                      <Input
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Study Group..."
                      />
                    </div>
                    <Button onClick={createGroup} className="btn-full">
                      Create Group
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="groups-list">
              {groups.map((group) => (
                <div
                  key={group._id}
                  onClick={() => setSelectedGroup(group)}
                  className={`group-item ${
                    selectedGroup?._id === group._id ? "selected" : ""
                  }`}
                >
                  <div className="group-avatar">
                    <Users className="icon" />
                  </div>
                  <div className="group-info">
                    <p className="group-name">{group.name}</p>
                    <p className="group-desc">
                      {group.description || "Group chat"}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>

          {/* Chats Panel */}
          <Card className="chats-panel">
            {selectedGroup ? (
              <>
                <div className="chats-header">
                  <div className="group-info-header">
                    <div className="group-avatar">
                      <Users className="icon" />
                    </div>
                    <div>
                      <h3 className="group-name-header">
                        {selectedGroup.name}
                      </h3>
                      <p className="group-status">Active now</p>
                    </div>
                  </div>
                  <div className="chats-header-actions">
                    <Button size="icon" variant="ghost">
                      <Phone className="icon" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Video className="icon" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="icon" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="chats-list">
                  {messages.map((message, idx) => {
                    const isOwn = message.senderId === user?._id;
                    return (
                      <div
                        key={idx}
                        className={`message-item ${isOwn ? "own" : ""}`}
                      >
                        <Avatar className="avatar">
                          <AvatarFallback>
                            {getInitials(message.senderName)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`message-content ${
                            isOwn ? "align-end" : ""
                          }`}
                        >
                          <p className="message-sender">
                            {message.senderName || "Unknown"}
                          </p>
                          <div
                            className={`message-bubble ${
                              isOwn ? "own-bubble" : ""
                            }`}
                          >
                            <p>{message.content}</p>
                          </div>
                          <p className="message-time">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef}></div>
                </ScrollArea>

                <div className="chats-input">
                  <Button size="icon" variant="ghost">
                    <Paperclip className="icon" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Mic className="icon" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="icon" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="chats-empty">
                <Users className="empty-icon" />
                <p>Select a chat to start messaging</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chats;
