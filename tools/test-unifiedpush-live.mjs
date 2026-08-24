#!/usr/bin/env node
import { sendUnifiedPushNotification } from "./unifiedpush-notification.mjs";

const result = await sendUnifiedPushNotification({
  text: "Agent notifications enabled for the current goal.",
  dedupeKey: "pnplabs-unifiedpush-live-test-v3"
});

if (result.status === "sent") {
  console.log(`unifiedpush_live_test_sent HTTP ${result.httpStatus}`);
} else if (result.status === "skipped") {
  console.log(`unifiedpush_live_test_skipped ${result.reason}`);
} else {
  console.log(`unifiedpush_live_test_failed ${result.reason}`);
}
