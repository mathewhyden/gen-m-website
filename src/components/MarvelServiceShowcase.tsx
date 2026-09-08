"use client";

import React from "react";
import RouletteCards, {
  defaultServices,
} from "./RouletteCards";
import { ServiceItem } from "@/lib/types";

export interface ServiceData {
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  visual: string;
  cta: string;
  tag: string;
  slug: string;
}

export const servicesData: ServiceData[] = defaultServices.map((s) => ({
  number: s.number,
  title: s.title,
  shortTitle: s.shortTitle,
  description: s.description,
  visual: s.image,
  cta: s.ctaText || "EXPLORE SERVICE →",
  tag: s.category,
  slug: s.slug,
}));

interface MarvelServiceShowcaseProps {
  services?: ServiceItem[];
  onSelectService?: (serviceName: string) => void;
  selectedSlug?: string;
  initialSelectedSlug?: string;
  isStandalonePage?: boolean;
}

export default function MarvelServiceShowcase({
  onSelectService,
  selectedSlug,
  initialSelectedSlug,
}: MarvelServiceShowcaseProps) {
  return (
    <div className="w-full flex flex-col">
      <RouletteCards
        services={defaultServices}
        onSelectService={onSelectService}
        selectedSlug={selectedSlug}
        initialSelectedSlug={initialSelectedSlug}
      />
    </div>
  );
}

export { RouletteCards };


