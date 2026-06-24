import { NextRequest, NextResponse } from "next/server";
import { contractorLeadSeeds, type ContractorLead } from "@/lib/data";

export const dynamic = "force-dynamic";

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  googleMapsUri?: string;
  nationalPhoneNumber?: string;
  businessStatus?: string;
  types?: string[];
};

const tradeQueries: Record<string, string> = {
  "Rainwater design / specialty integrator": "rainwater harvesting potable water system designer Austin Central Texas",
  "Excavation / dirt work": "excavation contractor trenching tank pad near Lampasas Hamilton Evant Texas",
  "Tank supplier / installer": "20000 gallon 30000 gallon potable rainwater tank supplier Austin Dripping Springs Texas",
  "Licensed plumber": "licensed plumber well water line backflow pressure tank near Hamilton Lampasas Texas",
  "Licensed electrician": "licensed electrician underground conduit pump circuit near Hamilton Lampasas Texas",
  "Water treatment / testing": "whole house water treatment UV carbon well water testing Austin Lampasas Texas",
  "Gutters / collection edge": "gutter contractor downspout screens rainwater collection Lampasas Marble Falls Texas",
  "Welding / fencing / utility protection": "welding fencing contractor utility enclosure Lampasas Hamilton Texas",
};

const tradeAreas: Record<string, string> = {
  "Rainwater design / specialty integrator": "Austin / Central Texas",
  "Excavation / dirt work": "Lampasas / Hamilton / Evant",
  "Tank supplier / installer": "Austin / Dripping Springs / Hill Country",
  "Licensed plumber": "Hamilton / Lampasas / Gatesville",
  "Licensed electrician": "Hamilton / Lampasas / Gatesville",
  "Water treatment / testing": "Austin plus Central Texas service area",
  "Gutters / collection edge": "Lampasas / Marble Falls / Burnet",
  "Welding / fencing / utility protection": "Lampasas / Hamilton",
};

const tradeNextActions: Record<string, string> = {
  "Rainwater design / specialty integrator": "Ask for a design-only consult, rough component list, potable assumptions, and referrals for local trades.",
  "Excavation / dirt work": "Ask for tank pad, trenching, overflow-to-pond, conduit coordination, compaction, and careful well-line exposure pricing.",
  "Tank supplier / installer": "Ask for 20k and 30k alternates, potable liner/coating, delivery to Evant, install, warranty, and written pad requirements.",
  "Licensed plumber": "Ask for source-selector valve box, check/backflow protection, pump plumbing, sample taps, and treatment tie-in.",
  "Licensed electrician": "Ask for underground conduit, pump disconnect, code separation from water lines, controls, and future backup readiness.",
  "Water treatment / testing": "Ask for certified testing, whole-house carbon, NSF/ANSI 55 Class A UV, sample taps, and annual service cost.",
  "Gutters / collection edge": "Ask for downspout screens, reroutes, cleanout access, slope corrections, and coordination with the roof washer.",
  "Welding / fencing / utility protection": "Ask for a simple tank/pump enclosure, gates, bollards, or other protection after the layout is set.",
};

function requestedTrades(trade: string) {
  if (trade === "All") {
    return Object.keys(tradeQueries);
  }
  if (tradeQueries[trade]) {
    return [trade];
  }
  const directMatch = Object.keys(tradeQueries).find((item) => item.includes(trade) || trade.includes(item));
  return directMatch ? [directMatch] : [trade];
}

function seededForTrade(trade: string) {
  if (trade === "All") {
    return contractorLeadSeeds;
  }

  return contractorLeadSeeds.filter((lead) => {
    const haystack = `${lead.trade} ${lead.priority} ${lead.fit}`.toLowerCase();
    return haystack.includes(trade.toLowerCase()) || trade.toLowerCase().includes(lead.trade.toLowerCase());
  });
}

function fallbackLeads(trade: string) {
  const seeded = seededForTrade(trade);
  return seeded.length ? seeded : contractorLeadSeeds;
}

function priorityFor(place: GooglePlace) {
  const rating = place.rating ?? 0;
  const count = place.userRatingCount ?? 0;

  if (rating >= 4.7 && count >= 35) return "High-review live lead";
  if (rating >= 4.4 && count >= 15) return "Good live lead";
  if (rating > 0) return "Needs review check";
  return "Research lead";
}

function placeToLead(place: GooglePlace, trade: string): ContractorLead {
  const rating = place.rating;
  const reviewCount = place.userRatingCount;
  const reviewPhrase = rating && reviewCount
    ? `${rating.toFixed(1)} stars from ${reviewCount} Google reviews`
    : "No review score returned by the live provider";

  return {
    trade,
    company: place.displayName?.text ?? "Unnamed contractor",
    area: tradeAreas[trade] ?? "Central Texas",
    phone: place.nationalPhoneNumber,
    sourceUrl: place.websiteUri ?? place.googleMapsUri,
    sourceLabel: "Live Google Places lookup",
    website: place.websiteUri,
    mapsUrl: place.googleMapsUri,
    address: place.formattedAddress,
    fit: `${reviewPhrase}. Match the website, photos, and reviews against this project's rural water, tank, trenching, potable plumbing, or treatment scope before hiring.`,
    nextAction: tradeNextActions[trade] ?? "Call to confirm service area, licensing, insurance, written scope, warranty, schedule, and similar project experience.",
    priority: priorityFor(place),
    rating,
    reviewCount,
    liveSource: "google-places",
  };
}

async function searchGooglePlaces(apiKey: string, trade: string, location: string, company?: string) {
  const textQuery = company
    ? `${company} ${trade} near ${location}`
    : tradeQueries[trade] ?? `${trade} contractor near ${location}`;
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.websiteUri",
        "places.googleMapsUri",
        "places.nationalPhoneNumber",
        "places.businessStatus",
        "places.types",
      ].join(","),
    },
    body: JSON.stringify({
      textQuery,
      maxResultCount: 8,
      locationBias: {
        circle: {
          center: { latitude: 31.476, longitude: -98.152 },
          radius: 85000,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Places request failed with ${response.status}`);
  }

  const data = await response.json() as { places?: GooglePlace[] };
  const places = data.places ?? [];
  return places
    .filter((place) => place.businessStatus !== "CLOSED_PERMANENTLY")
    .map((place) => placeToLead(place, trade));
}

export async function GET(request: NextRequest) {
  const trade = request.nextUrl.searchParams.get("trade") ?? "All";
  const location = request.nextUrl.searchParams.get("location") ?? "Evant, TX";
  const company = request.nextUrl.searchParams.get("company")?.trim();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const seeded = fallbackLeads(trade);

  if (!apiKey) {
    const matchingSeeded = company
      ? seeded.filter((lead) => lead.company.toLowerCase().includes(company.toLowerCase()) || company.toLowerCase().includes(lead.company.toLowerCase()))
      : seeded;

    return NextResponse.json({
      mode: "seeded",
      provider: "source-backed-list",
      updatedAt: new Date().toISOString(),
      message: "Add GOOGLE_PLACES_API_KEY to enable live rating and review-count lookup. Showing source-backed starter leads for now.",
      leads: matchingSeeded.length ? matchingSeeded : seeded,
    });
  }

  try {
    const trades = company && trade !== "All" ? [trade] : requestedTrades(trade);
    const results = await Promise.all(trades.map((item) => searchGooglePlaces(apiKey, item, location, company)));
    const unique = new Map<string, ContractorLead>();

    for (const lead of results.flat()) {
      const key = `${lead.trade}:${lead.company}:${lead.address ?? ""}`.toLowerCase();
      if (!unique.has(key)) {
        unique.set(key, lead);
      }
    }

    return NextResponse.json({
      mode: "live",
      provider: "google-places",
      updatedAt: new Date().toISOString(),
      message: "Live lookup complete. Review scores still need scope, licensing, insurance, and reference checks before hire.",
      leads: Array.from(unique.values()),
    });
  } catch (error) {
    return NextResponse.json({
      mode: "error",
      provider: "google-places",
      updatedAt: new Date().toISOString(),
      message: error instanceof Error ? error.message : "Live lookup failed. Showing source-backed starter leads.",
      leads: seeded,
    });
  }
}
