"use client";

import React, { useEffect, useState } from "react";
import RouletteCards, {
  defaultServices,
  ServiceCardData,
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

interface MarvelServiceShowcaseProps {
  services?: ServiceItem[];
  onSelectService?: (serviceName: string) => void;
  selectedSlug?: string;
  initialSelectedSlug?: string;
  isStandalonePage?: boolean;
}

export default function MarvelServiceShowcase({
  services: propServices,
  onSelectService,
  selectedSlug,
  initialSelectedSlug,
}: MarvelServiceShowcaseProps) {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(propServices || []);

  // Sync if propServices changes
  useEffect(() => {
    if (propServices && propServices.length > 0) {
      setServicesList(propServices);
    }
  }, [propServices]);

  // If no services provided as prop, fetch dynamically from Firestore API
  useEffect(() => {
    if (!propServices || propServices.length === 0) {
      fetch("/api/services")
        .then((res) => res.json())
        .then((data) => {
          if (data.services && Array.isArray(data.services) && data.services.length > 0) {
            setServicesList(data.services);
          }
        })
        .catch(() => {
          // Fallback to /api/content
          fetch("/api/content")
            .then((res) => res.json())
            .then((data) => {
              if (data.services && Array.isArray(data.services) && data.services.length > 0) {
                setServicesList(data.services);
              }
            })
            .catch(() => {});
        });
    }
  }, [propServices]);

  // Transform ServiceItem[] into ServiceCardData[]
  const cardServices: ServiceCardData[] = (
    servicesList.length > 0 ? servicesList : defaultServices
  ).map((s: any, idx: number) => {
    const num = String(idx + 1).padStart(2, "0");
    const img =
      s.coverImage ||
      s.image ||
      defaultServices[idx % defaultServices.length]?.image ||
      "/services/web-development.jpg";

    return {
      number: num,
      title: (s.title || "UNTITLED SERVICE").toUpperCase(),
      shortTitle: s.shortTitle || s.title || `SERVICE ${num}`,
      category: s.category || s.badge || "Specialized Service",
      description: s.description || "",
      image: img,
      slug: s.slug || s.id || `service-${idx + 1}`,
      ctaText: "EXPLORE SERVICE",
    };
  });

  return (
    <div className="w-full flex flex-col">
      <RouletteCards
        services={cardServices}
        onSelectService={onSelectService}
        selectedSlug={selectedSlug}
        initialSelectedSlug={initialSelectedSlug}
      />
    </div>
  );
}

export { RouletteCards };
