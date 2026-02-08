import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DiscussionDetail: React.FC = () => {
  const { id: repoId, number } = useParams<{ id: string; number: string }>();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [replyBody, setReplyBody] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  }, [repoId, number]);

  const fetchDiscussion = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/v1/repositories/${repoId}/discussions/${number}`,
      );
      const data = await res.json();
      setDiscussion(data);
    } catch (err) {
      console.error("Failed to fetch discussion", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (parentId?: string) => {
    const body = parentId ? replyBody[parentId] : commentBody;
    if (!body?.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/discussions/${discussion.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, parentId }),
      });
      if (!res.ok) throw new Error("Failed to add comment");

      setCommentBody("");
      setReplyBody({ ...replyBody, [parentId || ""]: "" });
      setReplyingTo(null);
      fetchDiscussion();
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleReaction = async (
    target: "discussion" | "comment",
    targetId: string,
    emoji: string,
  ) => {
    try {
      const endpoint =
        target === "discussion"
          ? `/api/v1/discussions/${targetId}/reactions`
          : `/api/v1/discussion-comments/${targetId}/reactions`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
      if (res.ok) fetchDiscussion();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAnswer = async (commentId: string) => {
    try {
      const res = await fetch(
        `/api/v1/discussions/${discussion.id}/mark-answer/${commentId}`,
        {
          method: "POST",
        },
      );
      if (res.ok) fetchDiscussion();
    } catch (err) {
      console.error(err);
    }
  };

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: any;
    isReply?: boolean;
  }) => (
    <div
      className={`p-4 ${isReply ? "ml-8 border-l-2 border-gh-border bg-gh-bg/30" : "bg-gh-bg-secondary border border-gh-border rounded-lg mb-4"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img
            src={
              comment.author?.avatar ||
              `https://ui-avatars.com/api/?name=${comment.author?.username}`
            }
            className="size-6 rounded-full"
            alt=""
          />
          <span className="text-sm font-bold text-gh-text">
            {comment.author?.username}
          </span>
          <span className="text-xs text-gh-text-secondary">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          {discussion.answerId === comment.id && (
            <span className="px-2 py-0.5 bg-green-600/20 text-green-500 rounded-full text-[10px] font-bold border border-green-600/30 flex items-center gap-1">
              <span className="material-symbols-outlined !text-[12px]">
                check_circle
              </span>
              Answer
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isReply &&
            discussion.category === "Q&A" &&
            !discussion.answerId && (
              <button
                onClick={() => handleMarkAnswer(comment.id)}
                className="text-xs text-gh-text-secondary hover:text-green-500 flex items-center gap-1"
              >
                <span className="material-symbols-outlined !text-[16px]">
                  check
                </span>
                Mark as Answer
              </button>
            )}
          {!isReply && (
            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="text-xs text-gh-text-secondary hover:text-primary flex items-center gap-1"
            >
              <span className="material-symbols-outlined !text-[16px]">
                reply
              </span>
              Reply
            </button>
          )}
        </div>
      </div>
      <div className="text-sm text-gh-text whitespace-pre-wrap mb-4">
        {comment.body}
      </div>

      {/* Reactions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["👍", "👎", "😄", "🎉", "❤️", "🚀", "👀"].map((emoji) => {
          const count =
            comment.reactions?.filter((r: any) => r.emoji === emoji).length ||
            0;
          return (
            <button
              key={emoji}
              onClick={() => handleToggleReaction("comment", comment.id, emoji)}
              className={`px-2 py-1 rounded-full border text-xs transition-all flex items-center gap-1 ${count > 0
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-gh-bg border-gh-border text-gh-text-secondary hover:border-gh-text"
                }`}
            >
              {emoji} {count > 0 && <span>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Reply Input */}
      {replyingTo === comment.id && (
        <div className="mt-4 space-y-2">
          <textarea
            value={replyBody[comment.id] || ""}
            onChange={(e) =>
              setReplyBody({ ...replyBody, [comment.id]: e.target.value })
            }
            placeholder="Write a reply..."
            className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:border-primary outline-none"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setReplyingTo(null)}
              className="px-3 py-1 text-xs text-gh-text-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddComment(comment.id)}
              disabled={!replyBody[comment.id]?.trim() || submitting}
              className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-bold"
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies?.map((reply: any) => (
        <CommentItem key={reply.id} comment={reply} isReply />
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="p-12 text-center">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  if (!discussion)
    return (
      <div className="p-12 text-center text-gh-text">Discussion not found</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-gh-text-secondary text-sm mb-2">
          <button onClick={() => navigate(-1)} className="hover:text-primary">
            Discussions
          </button>
          <span>/</span>
          <span>#{discussion.number}</span>
        </div>
        <h1 className="text-3xl font-bold text-gh-text mb-4">
          {discussion.title}
        </h1>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${discussion.category === "ANNOUNCEMENTS"
                ? "bg-purple-600/20 text-purple-400"
                : discussion.category === "Q&A"
                  ? "bg-green-600/20 text-green-400"
                  : discussion.category === "IDEAS"
                    ? "bg-blue-600/20 text-blue-400"
                    : "bg-gh-bg-tertiary text-gh-text-secondary"
              }`}
          >
            {discussion.category}
          </span>
          <div className="flex items-center gap-2 text-sm text-gh-text-secondary">
            <img
              src={
                discussion.author?.avatar ||
                `https://ui-avatars.com/api/?name=${discussion.author?.username}`
              }
              className="size-5 rounded-full"
              alt=""
            />
            <span className="font-bold text-gh-text">
              {discussion.author?.username}
            </span>
            <span>
              started this conversation on{" "}
              {new Date(discussion.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          {/* Main Discussion Post */}
          <div className="bg-gh-bg-secondary border border-gh-border rounded-lg p-6 mb-8">
            <div className="text-gh-text whitespace-pre-wrap mb-6 text-lg">
              {discussion.body}
            </div>
            <div className="flex flex-wrap gap-2">
              {["👍", "👎", "😄", "🎉", "❤️", "🚀", "👀"].map((emoji) => {
                const count =
                  discussion.reactions?.filter((r: any) => r.emoji === emoji)
                    .length || 0;
                return (
                  <button
                    key={emoji}
                    onClick={() =>
                      handleToggleReaction("discussion", discussion.id, emoji)
                    }
                    className={`px-3 py-1.5 rounded-full border text-sm transition-all flex items-center gap-2 ${count > 0
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-gh-bg border-gh-border text-gh-text-secondary hover:border-gh-text"
                      }`}
                  >
                    {emoji}{" "}
                    {count > 0 && <span className="font-bold">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer (if any) */}
          {discussion.answer && (
            <div className="mb-8 p-6 bg-green-600/10 border border-green-600/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-500 font-bold mb-4">
                <span className="material-symbols-outlined">check_circle</span>
                Marked as Answer
              </div>
              <div className="text-gh-text mb-4 italic">
                "{discussion.answer.body}"
              </div>
              <div className="flex items-center gap-2 text-sm text-gh-text-secondary">
                <img
                  src={discussion.answer.author?.avatar}
                  className="size-5 rounded-full"
                  alt=""
                />
                <span>{discussion.answer.author?.username}</span>
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gh-text mb-4">
              {discussion.comments?.length || 0} Comments
            </h2>
            {discussion.comments?.map((comment: any) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Root Comment Input */}
          <div className="mt-8 bg-gh-bg-secondary border border-gh-border rounded-lg p-4">
            <textarea
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder="Write a comment..."
              className="w-full bg-gh-bg border border-gh-border rounded-md px-4 py-3 text-gh-text focus:border-primary outline-none resize-none"
              rows={5}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleAddComment()}
                disabled={!commentBody.trim() || submitting}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-bold hover:bg-opacity-90 disabled:opacity-50"
              >
                {submitting ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          <div className="bg-gh-bg-secondary border border-gh-border rounded-lg p-4">
            <h3 className="text-sm font-bold text-gh-text mb-4 uppercase tracking-wider">
              Participants
            </h3>
            <div className="flex flex-wrap gap-2">
              <img
                src={discussion.author?.avatar}
                title={discussion.author?.username}
                className="size-8 rounded-full border border-gh-border"
                alt=""
              />
              {discussion.comments?.map((c: any) => (
                <img
                  key={c.id}
                  src={c.author?.avatar}
                  title={c.author?.username}
                  className="size-8 rounded-full border border-gh-border"
                  alt=""
                />
              ))}
            </div>
          </div>
          <div className="bg-gh-bg-secondary border border-gh-border rounded-lg p-4">
            <h3 className="text-sm font-bold text-gh-text mb-4 uppercase tracking-wider">
              Notifications
            </h3>
            <button className="w-full py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text text-sm font-bold hover:bg-gh-border">
              Subscribe
            </button>
            <p className="text-xs text-gh-text-secondary mt-2">
              You're not receiving notifications from this discussion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetail;
