"use client";

import React from "react";
import BentoCardShowcase, {
  teamData,
  DeveloperMember,
} from "./BentoCardShowcase";

export { teamData };
export type { DeveloperMember };

export default function TeamGenM() {
  return <BentoCardShowcase />;
}

export { BentoCardShowcase };

