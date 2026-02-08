import crypto from "crypto";
import axios from "axios";
import { PrismaClient, Webhook } from "@prisma/client";
import { AuditService } from "./audit";

const prisma = new PrismaClient();

/**
 * Integravity Webhook Service
 * Handles outbound notification delivery, signing, and tracking.
 */
export class WebhookService {
  /**
   * Dispatches a webhook to all active listeners for a specific event.
   */
  static async dispatch(repoId: string, event: string, payload: unknown) {
    console.log(
      `📡 [WebhookService]: Dispatching event '${event}' for repo ${repoId}`,
    );

    const webhooks = await prisma.webhook.findMany({
      where: {
        repoId,
        events: { has: event },
        active: true,
      },
    });

    for (const hook of webhooks) {
      this.send(hook, event, payload).catch((err) => {
        console.error(
          `❌ [WebhookService]: Delivery failed for hook ${hook.id}:`,
          err instanceof Error ? err.message : String(err),
        );
      });
    }
  }

  /**
   * Internal method to send a single webhook delivery.
   */
  private static async send(hook: Webhook, event: string, payload: unknown) {
    const guid = crypto.randomUUID();
    const body = JSON.stringify(payload);

    // 1. Generate HMAC Signature
    let signature = "";
    if (hook.secret) {
      signature = crypto
        .createHmac("sha256", hook.secret)
        .update(body)
        .digest("hex");
    }

    const start = Date.now();

    try {
      const response = await axios.post(hook.url, body, {
        headers: {
          "Content-Type": hook.contentType,
          "X-Trackcodex-Event": event,
          "X-Trackcodex-Delivery": guid,
          "X-Trackcodex-Signature-256": signature
            ? `sha256=${signature}`
            : undefined,
          "User-Agent": "TrackCodex-Hookshot/1.0",
        },
        timeout: 10000, // 10s timeout
      });

      // 2. Log Success
      await prisma.webhookDelivery.create({
        data: {
          webhookId: hook.id,
          event,
          guid,
          requestBody: payload as any,
          responseBody:
            typeof response.data === "string"
              ? response.data
              : JSON.stringify(response.data),
          responseCode: response.status,
          duration: Date.now() - start,
          status: "SUCCESS",
        },
      });
    } catch (err: any) {
      // 3. Log Failure
      await prisma.webhookDelivery.create({
        data: {
          webhookId: hook.id,
          event,
          guid,
          requestBody: payload as any,
          responseBody: err.response?.data
            ? JSON.stringify(err.response.data)
            : err.message,
          responseCode: err.response?.status || 500,
          duration: Date.now() - start,
          status: "FAILURE",
        },
      });

      throw err;
    }
  }

  /**
   * Create a new webhook for a repository or organization.
   */
  static async createWebhook(data: {
    url: string;
    secret?: string;
    repoId?: string;
    orgId?: string;
    events: string[];
  }) {
    const hook = await prisma.webhook.create({
      data: {
        url: data.url,
        secret: data.secret,
        repoId: data.repoId,
        orgId: data.orgId,
        events: data.events,
      },
    });

    await AuditService.log({
      actorId: "system",
      action: "WEBHOOK_CREATE",
      resource: `hook:${hook.id}`,
      details: { url: hook.url, events: hook.events },
    });

    return hook;
  }
}
