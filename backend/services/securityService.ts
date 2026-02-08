import { PrismaClient } from "@prisma/client";
import { AuditService } from "./audit";

const prisma = new PrismaClient();

/**
 * Integravity Security Service
 * Handles vulnerability scanning, secret detection, and code analysis.
 */
export class SecurityService {
  /**
   * Scans a repository for common security issues.
   */
  static async performFullScan(repoId: string) {
    console.log(
      `🛡️ [SecurityService]: Starting full security scan for ${repoId}`,
    );

    const alerts = [];

    // 1. Mock Secret Scanning
    const secretAlert = await this.scanForSecrets(
      repoId,
      "src/index.ts",
      "const key = 'AKIA...'",
    );
    if (secretAlert) alerts.push(secretAlert);

    // 2. Mock SCA (Dependabot)
    const scaAlert = await this.scanDependencies(repoId, { express: "4.16.0" });
    if (scaAlert) alerts.push(scaAlert);

    return alerts;
  }

  /**
   * Scan content for sensitive patterns (Secrets).
   */
  static async scanForSecrets(
    repoId: string,
    resource: string,
    content: string,
  ) {
    const patterns = [
      { name: "AWS Key", regex: /AKIA[0-9A-Z]{16}/g, severity: "CRITICAL" },
      {
        name: "Generic Secret",
        regex: /secret[_-]?key['"]?\s*[:=]\s*['"]?([^'"]+)/gi,
        severity: "HIGH",
      },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(content)) {
        return await prisma.securityAlert.create({
          data: {
            repoId,
            type: "SECRET",
            severity: pattern.severity,
            description: `Detected potential ${pattern.name} in ${resource}`,
            resource,
            status: "OPEN",
          },
        });
      }
    }
    return null;
  }

  /**
   * Scan dependencies for known vulnerabilities (SCA).
   */
  static async scanDependencies(
    repoId: string,
    dependencies: Record<string, string>,
  ) {
    // Legacy mock function - we prefer auditRepoDependencies below
    return null;
  }

  /**
   * Real SCA Scan using DependencyManager (Dependabot Clone)
   */
  static async auditRepoDependencies(repoId: string) {
    const { SCMService } = await import("./scmService"); // Lazy import to avoid cycle
    const { DependencyManager } = await import("./dependencyManager");
    const path = await SCMService.getRepoPath(repoId);

    const dm = new DependencyManager();
    const vulnerabilities = await dm.scanSecurityVulnerabilities(path); // Requires npm audit

    // If npm audit fails or returns nothing, check outdated as a fallback risk
    if (vulnerabilities.length === 0) {
      // Option: Check outdated
    }

    const alerts = [];
    for (const vuln of vulnerabilities) {
      const alert = await prisma.securityAlert.create({
        data: {
          repoId,
          type: "SCA",
          severity: vuln.severity.toUpperCase(),
          description: `${vuln.name}: ${vuln.via}`,
          resource: "package.json",
          status: "OPEN",
        },
      });
      alerts.push(alert);
    }
    return alerts;
  }

  /**
   * Fetch security alerts for a repository.
   */
  static async getAlerts(repoId: string) {
    return await prisma.securityAlert.findMany({
      where: { repoId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Dismiss or fix an alert.
   */
  static async updateAlertStatus(
    alertId: string,
    status: "DISMISSED" | "FIXED",
  ) {
    const alert = await prisma.securityAlert.update({
      where: { id: alertId },
      data: { status },
    });

    await AuditService.log({
      actorId: "system",
      action: "SECURITY_ALERT_UPDATE",
      resource: `alert:${alert.id}`,
      details: { status },
    });

    return alert;
  }

  /**
   * Ingest CodeQL/SARIF Results
   */
  static async uploadSarif(repoId: string, sarif: any) {
    const runs = sarif.runs || [];
    const alerts = [];

    for (const run of runs) {
      for (const result of run.results) {
        const ruleId = result.ruleId;
        const msg = result.message.text;
        const location =
          result.locations?.[0]?.physicaLocation?.artifactLocation?.uri ||
          "unknown";

        const alert = await prisma.securityAlert.create({
          data: {
            repoId,
            type: "SAST", // CodeQL
            severity: "HIGH", // Default, should parse rule severity
            description: `${ruleId}: ${msg}`,
            resource: location,
            status: "OPEN",
          },
        });
        alerts.push(alert);
      }
    }
    return alerts;
  }
}
