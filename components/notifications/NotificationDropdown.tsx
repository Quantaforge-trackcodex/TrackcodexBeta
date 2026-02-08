import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
}) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const navigate = useNavigate();

  const handleClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <div className="absolute left-[70px] bottom-12 w-80 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-[200] flex flex-col max-h-[400px] animate-in slide-in-from-left-2 duration-200">
      <div className="p-4 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117] rounded-t-xl">
        <h3 className="text-sm font-bold text-white">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wide"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <span className="material-symbols-outlined !text-[32px] mb-2 opacity-50">
              notifications_off
            </span>
            <span className="text-xs">No new notifications</span>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleClick(notif.id, notif.link)}
              className={`p-3 rounded-lg border transition-all cursor-pointer group relative ${
                notif.read
                  ? "bg-transparent border-transparent hover:bg-white/5 opacity-60"
                  : "bg-[#0d1117] border-blue-500/30 hover:border-blue-500/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`size-2 mt-1.5 rounded-full shrink-0 ${
                    notif.type === "job_match"
                      ? "bg-emerald-500"
                      : notif.type === "alert"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-xs font-bold mb-1 truncate ${
                      notif.read ? "text-slate-400" : "text-white"
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="text-[9px] text-slate-600 font-mono mt-2 block">
                    {new Date(notif.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1"
                >
                  <span className="material-symbols-outlined !text-[14px]">
                    close
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
