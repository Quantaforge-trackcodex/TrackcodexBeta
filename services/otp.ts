export const otpService = {
  // Store codes in memory for this session (simulating backend storage)
  _codes: new Map<string, string>(),

  /**
   * Simulates sending an OTP to the provided email.
   * In a real app, this would call your backend API.
   */
  async sendOTP(email: string): Promise<boolean> {
    // Generate random 6-digit code for verification
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store it locally for verification logic
    this._codes.set(email, code);

    // Call Backend to send real email via Resend
    try {
      // Backend (Fastify) is on port 4000, Frontend (Vite) is on 3000
      // We pass 'credentials: include' to ensure cookies are shared if they exist
      const res = await fetch("http://localhost:3001/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        // Silently fall back to mock if not configured or auth fails
        // This is better than a crash for the prototype
        console.warn(
          `[OTP Backup] Backend email failed (${res.status}). Using local mock.`,
        );
        throw new Error("Backend unavailable");
      }

      console.log(`[OTP SERVICE] Real email sent to ${email}`);

      // FOR USER CONVENIENCE IN THIS DEMO:
      alert(`[Dev Helper] Your OTP code is: ${code}`);

      return true;
    } catch (e: any) {
      // Dev/Prototype Mode - "Make it Real-ish"
      // Instead of an error alert, we simulate the email arrival via console/alert logic
      console.log(
        `%c[OTP SIMULATOR] Email to ${email} -> Code: ${code}`,
        "color: #10b981; font-weight: bold; font-size: 16px; padding: 4px; border: 1px solid #10b981; border-radius: 4px;",
      );

      // Friendly toast/notification instead of error
      // Since we are in a service, we'll use a timeout specific Alert that explains
      // "Check your Simulator Console" or just gives the code for convenience
      setTimeout(() => {
        alert(
          `[Development Mode]\n\nSince "Resend" API is not configured locally, here is your simulated Verification Code:\n\n${code}\n\n(Enter this code to proceed)`,
        );
      }, 500);

      return true;
    }
  },

  /**
   * Verifies the provided code against the stored one.
   */
  async verifyOTP(email: string, code: string): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const storedCode = this._codes.get(email);

    if (storedCode && storedCode === code) {
      this._codes.delete(email); // consume code
      return true;
    }

    throw new Error("Invalid verification code. Please try again.");
  },
};
