import { useState, useCallback } from "react";
import { getAllPosts, createPost, deletePost } from "../api/posts";
import { getComments, createComment } from "../api/comments";
import { getReactions, upsertReaction, deleteReaction } from "../api/reactions";
import { uploadFile } from "../api/files";
import { toast } from "sonner";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants";

export function usePost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [postReactions, setPostReactions] = useState({});
  const [postComments, setPostComments] = useState({});

  const loadPosts = useCallback(async (courseId = null) => {
    try {
      setLoading(true);
      const data = await getAllPosts(courseId);
      setPosts(data || []);

      if (data && data.length > 0) {
        data.forEach((post) => {
          loadPostReactions(post._id);
          loadPostComments(post._id);
        });
      }

      return data;
    } catch (error) {
      console.error("Error loading posts:", error);
      if (error.response?.status !== 404) {
        toast.error(ERROR_MESSAGES.SERVER_ERROR);
      }
      setPosts([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPostReactions = useCallback(async (postId) => {
    try {
      const data = await getReactions(postId);
      setPostReactions((prev) => ({
        ...prev,
        [postId]: data,
      }));
    } catch (error) {
      console.error("Error loading reactions:", error);
    }
  }, []);

  const loadPostComments = useCallback(async (postId) => {
    try {
      const data = await getComments(postId);
      setPostComments((prev) => ({
        ...prev,
        [postId]: data,
      }));
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }, []);

  const handleCreatePost = useCallback(async (postData, images = []) => {
    try {
      setCreating(true);

      const uploadedFileIds = [];
      for (const image of images) {
        const uploadedFile = await uploadFile(image);
        uploadedFileIds.push(uploadedFile._id);
      }

      const newPost = await createPost({
        ...postData,
        attachmentsId: uploadedFileIds,
      });

      setPosts((prev) => [newPost, ...prev]);
      toast.success(SUCCESS_MESSAGES.POST_CREATED);
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
      throw error;
    } finally {
      setCreating(false);
    }
  }, []);

  const handleDeletePost = useCallback(async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success(SUCCESS_MESSAGES.POST_DELETED);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(ERROR_MESSAGES.SERVER_ERROR);
      throw error;
    }
  }, []);

  const handleReaction = useCallback(
    async (postId, type) => {
      try {
        const currentReaction = postReactions[postId]?.userReaction;

        if (currentReaction === type) { await deleteReaction(postId);
        } else { await upsertReaction(postId, type); }

        await loadPostReactions(postId);
      } catch (error) {
        console.error("Error handling reaction:", error);
        toast.error("Failed to update reaction");
      }
    },
    [postReactions, loadPostReactions]
  );

  const handleAddComment = useCallback(
    async (postId, commentText) => {
      if (!commentText || !commentText.trim())  return;

      try {
        await createComment(postId, commentText);
        await loadPostComments(postId);
        toast.success(SUCCESS_MESSAGES.COMMENT_ADDED);
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error("Failed to add comment");
        throw error;
      }
    },
    [loadPostComments]
  );

  return { posts, loading, creating, postReactions, postComments, loadPosts, loadPostReactions, loadPostComments, 
    handleCreatePost, handleDeletePost, handleReaction, handleAddComment, };
}
