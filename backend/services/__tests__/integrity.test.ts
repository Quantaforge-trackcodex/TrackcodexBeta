import { CryptographicService } from "../integrity";
import { createHash } from "crypto";

describe("CryptographicService", () => {
  describe("calculateVerificationHash", () => {
    it("should produce deterministic SHA-256 hash", () => {
      const commitData = {
        gitCommitHash: "e5bf3b...",
        treeHash: "a1b2c3...",
        parentHashes: ["parent1"],
        authorName: "Alice",
        authorEmail: "alice@example.com",
        authorDate: "2023-01-01T00:00:00Z",
        committerName: "Alice",
        committerEmail: "alice@example.com",
        committerDate: "2023-01-01T00:00:00Z",
        message: "Initial commit",
      };

      const hash1 = CryptographicService.calculateVerificationHash(
        commitData,
        null,
      );
      const hash2 = CryptographicService.calculateVerificationHash(
        commitData,
        null,
      );

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // SHA-256 hex
    });

    it("should change hash if metadata changes", () => {
      const baseData = {
        gitCommitHash: "e5bf3b...",
        treeHash: "a1b2c3...",
        parentHashes: ["parent1"],
        authorName: "Alice",
        authorEmail: "alice@example.com",
        authorDate: "2023-01-01T00:00:00Z",
        committerName: "Alice",
        committerEmail: "alice@example.com",
        committerDate: "2023-01-01T00:00:00Z",
        message: "Initial commit",
      };

      const hash1 = CryptographicService.calculateVerificationHash(
        baseData,
        null,
      );

      const modifiedData = { ...baseData, message: "Tampered message" };
      const hash2 = CryptographicService.calculateVerificationHash(
        modifiedData,
        null,
      );

      expect(hash1).not.toBe(hash2);
    });
  });
});
