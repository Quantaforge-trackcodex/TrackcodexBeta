import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Storage configuration
const RESUME_STORAGE_PATH = path.join(
  process.cwd(),
  "data",
  "uploads",
  "resumes",
);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt"];

export class ResumeService {
  /**
   * Upload and store user resume
   */
  static async uploadResume(
    userId: string,
    filename: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // 1. Validate file size
      if (fileBuffer.length > MAX_FILE_SIZE) {
        return {
          success: false,
          error: "File size exceeds 5MB limit",
        };
      }

      // 2. Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return {
          success: false,
          error: "Invalid file type. Allowed: PDF, DOC, DOCX, TXT",
        };
      }

      // 3. Validate extension
      const ext = path.extname(filename).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return {
          success: false,
          error: "Invalid file extension",
        };
      }

      // 4. Create user directory
      const userDir = path.join(RESUME_STORAGE_PATH, userId);
      await fs.mkdir(userDir, { recursive: true });

      // 5. Generate safe filename with hash to prevent overwrites
      const hash = createHash("md5")
        .update(fileBuffer)
        .digest("hex")
        .substring(0, 8);
      const safeFilename = `resume_${hash}${ext}`;
      const filePath = path.join(userDir, safeFilename);

      // 6. Write file
      await fs.writeFile(filePath, fileBuffer);

      // 7. Update database
      await prisma.user.update({
        where: { id: userId },
        data: {
          resumeUrl: `/uploads/resumes/${userId}/${safeFilename}`,
          resumeFilename: filename,
          resumeUploadedAt: new Date(),
        },
      });

      return {
        success: true,
        url: `/uploads/resumes/${userId}/${safeFilename}`,
      };
    } catch (error) {
      console.error("Resume upload error:", error);
      return {
        success: false,
        error: "Failed to upload resume",
      };
    }
  }

  /**
   * Get resume file path
   */
  static async getResumePath(userId: string): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { resumeUrl: true },
      });

      if (!user?.resumeUrl) return null;

      // Convert URL to file system path
      const relPath = user.resumeUrl.replace("/uploads/resumes/", "");
      return path.join(RESUME_STORAGE_PATH, relPath);
    } catch (error) {
      console.error("Error getting resume path:", error);
      return null;
    }
  }

  /**
   * Download resume
   */
  static async getResume(userId: string): Promise<{
    buffer?: Buffer;
    filename?: string;
    error?: string;
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { resumeUrl: true, resumeFilename: true, showResume: true },
      });

      if (!user?.resumeUrl) {
        return { error: "No resume found" };
      }

      // Check privacy settings
      if (!user.showResume) {
        return { error: "Resume is private" };
      }

      const filePath = await this.getResumePath(userId);
      if (!filePath) {
        return { error: "Resume file not found" };
      }

      const buffer = await fs.readFile(filePath);

      return {
        buffer,
        filename: user.resumeFilename || "resume.pdf",
      };
    } catch (error) {
      console.error("Error downloading resume:", error);
      return { error: "Failed to download resume" };
    }
  }

  /**
   * Delete resume
   */
  static async deleteResume(
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const filePath = await this.getResumePath(userId);

      if (filePath) {
        await fs.unlink(filePath);
      }

      // Update database
      await prisma.user.update({
        where: { id: userId },
        data: {
          resumeUrl: null,
          resumeFilename: null,
          resumeUploadedAt: null,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting resume:", error);
      return {
        success: false,
        error: "Failed to delete resume",
      };
    }
  }

  /**
   * Update profile README
   */
  static async updateProfileReadme(
    userId: string,
    readme: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          profileReadme: readme,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating profile README:", error);
      return {
        success: false,
        error: "Failed to update profile README",
      };
    }
  }

  /**
   * Update privacy settings
   */
  static async updatePrivacy(
    userId: string,
    showResume?: boolean,
    showReadme?: boolean,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {};
      if (showResume !== undefined) updateData.showResume = showResume;
      if (showReadme !== undefined) updateData.showReadme = showReadme;

      await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      return {
        success: false,
        error: "Failed to update privacy settings",
      };
    }
  }
}
