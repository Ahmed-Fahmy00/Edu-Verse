import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, Avatar, AvatarFallback } from "@/components/ui/display";
import { Input, Label } from "@/components/ui/form-elements";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/overlay";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Plus, Users, Paperclip, Mic, Phone, Video, MoreVertical } from "lucide-react";
import { toast } from "sonner";

const Messages = () => {
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchGroups(user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages(selectedGroup.id);
      
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `group_id=eq.${selectedGroup.id}`
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
            scrollToBottom();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchGroups = async (userId: string) => {
    const { data } = await supabase
      .from("group_members")
      .select(`
        *,
        chat_groups (*)
      `)
      .eq("user_id", userId);
    
    if (data) {
      setGroups(data.map(d => d.chat_groups));
    }
  };

  const fetchMessages = async (groupId: string) => {
    const { data } = await supabase
      .from("messages")
      .select(`
        *,
        profiles:sender_id (name)
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });
    
    setMessages(data || []);
  };

  const createGroup = async () => {
    if (!newGroupName) {
      toast.error("Please enter a group name");
      return;
    }

    const { data: groupData, error: groupError } = await supabase
      .from("chat_groups")
      .insert([{
        name: newGroupName,
        created_by: user?.id
      }])
      .select()
      .single();

    if (groupError || !groupData) {
      toast.error("Failed to create group");
      return;
    }

    const { error: memberError } = await supabase
      .from("group_members")
      .insert([{
        group_id: groupData.id,
        user_id: user?.id
      }]);

    if (memberError) {
      toast.error("Failed to join group");
    } else {
      toast.success("Group created!");
      setCreateGroupOpen(false);
      setNewGroupName("");
      fetchGroups(user?.id);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const { error } = await supabase
      .from("messages")
      .insert([{
        group_id: selectedGroup.id,
        sender_id: user?.id,
        content: newMessage,
        message_type: "text"
      }]);

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }
  };

  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-4 h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-12 gap-4 h-full">
          <Card className="col-span-3 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Chats</h2>
              <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Group Name</Label>
                      <Input
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Study Group..."
                      />
                    </div>
                    <Button onClick={createGroup} className="w-full">Create Group</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedGroup?.id === group.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{group.name}</p>
                        <p className="text-xs opacity-70 truncate">
                          {group.description || "Group chat"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          <Card className="col-span-9 flex flex-col">
            {selectedGroup ? (
              <>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedGroup.name}</h3>
                      <p className="text-xs text-muted-foreground">Active now</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, idx) => {
                      const isOwn = message.sender_id === user?.id;
                      return (
                        <div key={idx} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(message.profiles?.name || "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex flex-col ${isOwn ? "items-end" : ""}`}>
                            <p className="text-xs text-muted-foreground mb-1">
                              {message.profiles?.name || "Unknown"}
                            </p>
                            <div
                              className={`px-4 py-2 rounded-2xl max-w-md ${
                                isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(message.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;
