import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { workspaceCollaborationService } from "../services/workspaceCollaborationService";
import Spinner from "../components/ui/Spinner";

const AcceptInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Processing your invitation...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid invitation link. No token provided.");
      return;
    }

    const acceptInvite = async () => {
      try {
        await workspaceCollaborationService.acceptInvite(token);
        setStatus("success");
        setMessage(
          "Invitation accepted successfully! Redirecting you to the workspace...",
        );

        // Redirect to home or workspace after short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error: any) {
        console.error("Failed to accept invite:", error);
        setStatus("error");
        setMessage(
          error.message ||
            "Failed to accept invitation. It may have expired or already been accepted.",
        );
      }
    };

    acceptInvite();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center shadow-xl">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Spinner size="lg" />
            <h2 className="text-xl font-bold mt-6 mb-2 text-white">
              Accepting Invitation
            </h2>
            <p className="text-[#8b949e]">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#238636]/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#238636] text-3xl">
                check_circle
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">Success!</h2>
            <p className="text-[#8b949e] mb-6">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#238636] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#2ea043] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#f85149]/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[#f85149] text-3xl">
                error
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-white">
              Unable to Join
            </h2>
            <p className="text-[#8b949e] mb-6">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#21262d] text-[#c9d1d9] border border-[#30363d] px-6 py-2 rounded-lg font-medium hover:bg-[#30363d] transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite;
