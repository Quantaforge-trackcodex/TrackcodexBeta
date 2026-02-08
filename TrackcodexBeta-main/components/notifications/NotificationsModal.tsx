import React from "react";

interface Notification {
  id: string;
  type: "job" | "comment" | "community" | "system" | "info";
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d] bg-[#161b22]/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined !text-[20px]">
                notifications
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              <p className="text-xs text-slate-400">
                Stay updated with your activity
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors  uppercase tracking-wider"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Close"
            >
              <span className="material-symbols-outlined !text-[20px]">
                close
              </span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <span className="material-symbols-outlined !text-[48px] mb-4 opacity-50">
                notifications_off
              </span>
              <p className="text-sm font-medium">No notifications yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border border-transparent hover:border-[#30363d] hover:bg-[#161b22] transition-all cursor-pointer group flex gap-4 ${!notif.read ? "bg-[#161b22]/50" : ""}`}
                >
                  {/* Icon */}
                  <div
                    className={`mt-1 size-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner ${
                      notif.type === "job"
                        ? "bg-amber-500/10 text-amber-500"
                        : notif.type === "comment"
                          ? "bg-blue-500/10 text-blue-500"
                          : notif.type === "community"
                            ? "bg-purple-500/10 text-purple-500"
                            : "bg-slate-500/10 text-slate-400"
                    }`}
                  >
                    <span className="material-symbols-outlined !text-[20px]">
                      {notif.type === "job"
                        ? "work"
                        : notif.type === "comment"
                          ? "chat_bubble"
                          : notif.type === "community"
                            ? "local_fire_department"
                            : "info"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className={`text-sm font-bold ${!notif.read ? "text-white" : "text-slate-300"}`}
                      >
                        {notif.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                        {notif.createdAt
                          ? new Date(notif.createdAt).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "Just now"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {!notif.read && (
                    <div className="mt-2 text-primary" title="Unread">
                      <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#30363d] bg-[#161b22]/30 rounded-b-2xl flex justify-end">
          {/* Could add pagination or filters here later */}
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
