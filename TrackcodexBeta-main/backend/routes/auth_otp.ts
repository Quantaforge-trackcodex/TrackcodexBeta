import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Helper to generate 6 digit code
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function authOtpRoutes(fastify: FastifyInstance) {

    // Send OTP
    fastify.post('/auth/otp/send', async (request, reply) => {
        const { email } = request.body as any;
        if (!email) return reply.code(400).send({ error: "Email required" });

        // Find or Create user (Passwordless flow supports both sign up and login)
        const user = await prisma.user.findUnique({ where: { email } });

        // If user doesn't exist, should we create them? 
        // For security, usually we only allow existing users or have a separate register flow.
        // Let's assume for this "Login with OTP" feature, the user must exist.
        if (!user) {
            return reply.code(404).send({ error: "User not found. Please sign up first." });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await prisma.user.update({
            where: { id: user.id },
            data: {
                otpCode: otp,
                otpExpiresAt: expiresAt
            }
        });

        // MOCK EMAIL SENDING
        console.log(`\x1b[33m[EMAIL MOCK] Sending OTP to ${email}: ${otp}\x1b[0m`);

        return { success: true, message: "OTP sent to email." };
    });

    // Verify OTP
    fastify.post('/auth/otp/verify', async (request, reply) => {
        const { email, code } = request.body as any;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return reply.code(400).send({ error: "User not found" });

        if (!user.otpCode || !user.otpExpiresAt) {
            return reply.code(400).send({ error: "No OTP requested" });
        }

        if (new Date() > user.otpExpiresAt) {
            return reply.code(400).send({ error: "OTP expired" });
        }

        if (user.otpCode !== code) {
            return reply.code(400).send({ error: "Invalid code" });
        }

        // Success - Clear OTP
        await prisma.user.update({
            where: { id: user.id },
            data: { otpCode: null, otpExpiresAt: null }
        });

        // Issue Session Token (Reuse existing Session logic if available, or just return mock token)
        // Ideally we'd reuse the logic from auth.ts
        // For now, let's return a simple success and assume frontend handles state

        return {
            success: true,
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        };
    });
}
