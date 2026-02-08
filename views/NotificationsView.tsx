import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";

const MOCK_INBOX = [
  {
    id: 1,
    type: "job",
    title: "New Mission Offer: AI Core Optimization",
    repo: "cyberdyne/skynet-core",
    message:
      'Cyberdyne Systems wants you for "AI Core Optimization". This is a high-priority mission with a reward bounty of $50,000.',
    time: "2m ago",
    read: false,
    author: "Cyberdyne HR",
    avatar: "https://ui-avatars.com/api/?name=C+S&background=random",
  },
  {
    id: 2,
    type: "mention",
    title: "Mentioned in PR #42",
    repo: "trackcodex/frontend",
    message:
      "@alex-coder Great work on the refactor! Can you check the responsiveness on mobile?",
    time: "1h ago",
    read: true,
    author: "sarah-connor",
    avatar: "https://ui-avatars.com/api/?name=S+C&background=random",
  },
  {
    id: 3,
    type: "community",
    title: 'Trending: "Rust vs C++ in 2024"',
    repo: "community/discussions",
    message: "Your post is trending with 150 upvotes and 45 comments.",
    time: "3h ago",
    read: true,
    author: "System",
    avatar: "https://ui-avatars.com/api/?name=T+C&background=000&color=fff",
  },
  {
    id: 4,
    type: "review_request",
    title: "Review Requested: Feature/Dark-Mode",
    repo: "trackcodex/design-system",
    message: "requested your review on this pull request.",
    time: "5h ago",
    read: true,
    author: "design-lead",
    avatar: "https://ui-avatars.com/api/?name=D+L&background=random",
  },
  {
    id: 5,
    type: "security",
    title: "Security Alert: Lodash Vulnerability",
    repo: "trackcodex/backend-api",
    message:
      "Dependabot detected a high severity vulnerability in lodash version 4.17.15.",
    time: "1d ago",
    read: true,
    author: "dependabot",
    avatar: "https://avatars.githubusercontent.com/in/29110?v=4",
  },
];

const NotificationsView = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Inbox");
  const [notifications, setNotifications] = useState(MOCK_INBOX);
  const [searchQuery, setSearchQuery] = useState("is:unread");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex h-full bg-[#0d1117] text-[#c9d1d9] font-sans">
      {/* Sidebar Filter */}
      <div className="w-[296px] border-r border-[#30363d] p-0 flex flex-col hidden md:flex shrink-0">
        <div className="flex flex-col gap-0.5 py-2">
          {["Inbox", "Saved", "Done"].map((f) => (
            <div key={f} className="px-2">
              <button
                onClick={() => setFilter(f)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-[14px] flex items-center justify-between transition-colors outline-none
                                ${
                                  filter === f
                                    ? "bg-[#1f6feb]/10 text-[#c9d1d9] font-semibold border-l-2 border-[#1f6feb] rounded-l-none"
                                    : "text-[#c9d1d9] hover:bg-[#161b22]"
                                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined !text-[16px] opacity-70">
                    {f === "Inbox"
                      ? "inbox"
                      : f === "Saved"
                        ? "bookmark"
                        : "check"}
                  </span>
                  {f}
                </div>
                {f === "Inbox" && unreadCount > 0 && (
                  <span className="bg-[#1f6feb]/40 text-[#58a6ff] text-[12px] px-2 rounded-full font-medium leading-4">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="h-px bg-[#30363d] my-2 mx-0"></div>

        <div className="px-4 py-2">
          <h3 className="text-[12px] font-semibold text-[#8b949e] mb-2 px-1">
            Filters
          </h3>
          <div className="flex flex-col gap-0.5">
            {[
              "Assigned",
              "Participating",
              "Mentioned",
              "Team mentioned",
              "Review requested",
            ].map((f) => (
              <button
                key={f}
                className="text-left px-2 py-1.5 rounded-md text-[14px] text-[#c9d1d9] hover:bg-[#161b22] hover:text-[#58a6ff] transition-colors flex items-center gap-2"
              >
                <div className="size-1.5 rounded-full bg-[#8b949e]/40"></div>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        {/* Header with Search and Actions */}
        <header className="h-[60px] border-b border-[#30363d] flex items-center justify-between px-6 bg-[#0d1117] sticky top-0 z-10 shrink-0">
          {/* Search Bar Area */}
          <div className="flex items-center gap-2 flex-1 max-w-4xl">
            <div className="flex items-center gap-1 bg-[#21262d] border border-[#30363d] rounded-md overflow-hidden">
              <button className="px-3 py-1.5 text-[13px] font-medium text-[#c9d1d9] hover:bg-[#30363d] border-r border-[#30363d]">
                All
              </button>
              <button className="px-3 py-1.5 text-[13px] font-medium text-[#c9d1d9] bg-[#1f6feb] text-white">
                Unread
              </button>
            </div>

            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined !text-[18px] text-[#8b949e]">
                search
              </span>
              <label htmlFor="notifications-search" className="sr-only">
                Search notifications
              </label>
              <input
                id="notifications-search"
                type="text"
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-1.5 pl-9 pr-8 text-[14px] text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search notifications"
                placeholder="Search notifications"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e] hover:text-[#c9d1d9]">
                <span className="material-symbols-outlined !text-[16px]">
                  close
                </span>
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4 ml-4">
            <button className="text-[13px] font-medium text-[#8b949e] hover:text-[#58a6ff] flex items-center gap-1">
              Group by: Date
              <span className="material-symbols-outlined !text-[16px]">
                arrow_drop_down
              </span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          {/* "Clear out the clutter" Banner */}
          {notifications.length > 0 && unreadCount > 0 && (
            <div className="bg-gradient-to-r from-[#161b22] to-[#1f2428] border border-[#30363d] rounded-md p-6 mb-6 flex items-start justify-between shadow-sm">
              <div className="flex gap-4">
                <span className="material-symbols-outlined !text-[36px] text-[#58a6ff] mt-1">
                  Inbox
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#c9d1d9] mb-1">
                    Clear out the clutter.
                  </h3>
                  <p className="text-[14px] text-[#8b949e] leading-relaxed max-w-xl">
                    Get the most out of your new inbox by quickly and easily
                    marking all of your previously read notifications as done.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 border border-[#30363d] rounded-md text-[14px] font-medium text-[#c9d1d9] hover:bg-[#30363d] transition-colors">
                  Dismiss
                </button>
                <button
                  onClick={markAllRead}
                  className="px-4 py-1.5 bg-[#238636] border border-[#2ea043] rounded-md text-[14px] font-medium text-white hover:bg-[#2ea043] transition-colors shadow-sm"
                >
                  Mark all as done
                </button>
              </div>
            </div>
          )}

          {/* Notification List */}
          {notifications.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState />
            </div>
          ) : (
            <div className="bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden shadow-sm">
              <div className="bg-[#161b22] p-3 border-b border-[#30363d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined !text-[20px] text-[#8b949e]">
                    check_box_outline_blank
                  </span>
                  <span className="text-[13px] font-semibold text-[#c9d1d9]">
                    Select all
                  </span>
                </div>
              </div>
              <div className="divide-y divide-[#30363d]">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 flex gap-3 hover:bg-[#21262d] transition-colors group cursor-pointer ${!notif.read ? "bg-[#1f2428]" : "bg-[#0d1117]"}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="pt-1.5 shrink-0 px-2">
                      <span
                        className={`material-symbols-outlined !text-[18px] ${
                          notif.type === "job"
                            ? "text-amber-500"
                            : notif.type === "mention"
                              ? "text-blue-500"
                              : notif.type === "review_request"
                                ? "text-purple-500"
                                : notif.type === "security"
                                  ? "text-rose-500"
                                  : "text-[#8b949e]"
                        }`}
                      >
                        {notif.type === "job"
                          ? "work"
                          : notif.type === "mention"
                            ? "alternate_email"
                            : notif.type === "review_request"
                              ? "rate_review"
                              : notif.type === "security"
                                ? "security"
                                : "forum"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-medium text-[#8b949e]">
                          {notif.repo}
                        </span>
                        <span className="text-[#8b949e] text-[12px]">•</span>
                        <span className="text-[12px] text-[#8b949e]">
                          {notif.time}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <h3
                          className={`text-[15px] font-semibold ${!notif.read ? "text-[#c9d1d9]" : "text-[#8b949e]"}`}
                        >
                          {notif.title}
                        </h3>
                        <span className="text-[14px] text-[#8b949e] truncate max-w-xl">
                          {notif.message}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity self-start pt-1">
                      <button
                        title="Done"
                        className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-[#58a6ff]"
                      >
                        <span className="material-symbols-outlined !text-[18px]">
                          check
                        </span>
                      </button>
                      <button
                        title="Unsubscribe"
                        className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-[#c9d1d9]"
                      >
                        <span className="material-symbols-outlined !text-[18px]">
                          notifications_off
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsView;
