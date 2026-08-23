#!/usr/bin/env node
import { sendUnifiedPushNotification } from "./unifiedpush-notification.mjs";

const result = await sendUnifiedPushNotification({
  title: "PNP Labs UnifiedPush test",
  message: "UnifiedPush progress notifications are configured. ntfy has been replaced.",
  dedupeKey: "pnplabs-unifiedpush-live-test-v1"
});

if (result.status === "sent") {
  console.log(`unifiedpush_live_test_sent HTTP ${result.httpStatus}`);
} else if (result.status === "skipped") {
  console.log(`unifiedpush_live_test_skipped ${result.reason}`);
} else {
  console.log(`unifiedpush_live_test_failed ${result.reason}`);
}
