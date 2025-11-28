import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/display";
import { Input, Textarea, Label } from "@/components/ui/form-elements";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/overlay";
import { Users, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchGroups(user.id);
      }
    });
  }, []);

  const fetchGroups = async (userId: string) => {
    const { data } = await supabase
      .from("group_members")
      .select(`
        *,
        chat_groups (
          *,
          group_members (count)
        )
      `)
      .eq("user_id", userId);
    
    if (data) {
      setGroups(data.map(d => d.chat_groups));
    }
  };

  const createGroup = async () => {
    if (!newGroup.name) {
      toast.error("Please enter a group name");
      return;
    }

    const { data: groupData, error: groupError } = await supabase
      .from("chat_groups")
      .insert([{
        name: newGroup.name,
        description: newGroup.description,
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
      setOpen(false);
      setNewGroup({ name: "", description: "" });
      fetchGroups(user?.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
            Groups
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Group Name *</Label>
                  <Input
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    placeholder="Study Group"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="A place to discuss..."
                  />
                </div>
                <Button onClick={createGroup} className="w-full">Create Group</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="p-6 hover:shadow-[var(--shadow-card)] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{group.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {group.description || "No description"}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {group.group_members?.[0]?.count || 0} members
                </span>
                <Button
                  onClick={() => navigate("/messages")}
                  variant="ghost"
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Groups;
