"use client";

import { useAura } from "@/lib/aura-context";
import AuraBackground from "./AuraBackground";

export default function AuraBackgroundWrapper() {
  const { aura } = useAura();
  return <AuraBackground aura={aura} />;
}
