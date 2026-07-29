// app/lib/delivery.ts
export type LagosArea = "alimosho" | "mainland" | "island";

export const LAGOS_AREA_OPTIONS: { value: LagosArea; label: string }[] = [
  {
    value: "alimosho",
    label: "Alimosho (Ikotun, Igando, Egbeda, Idimu & Environs)",
  },
  {
    value: "mainland",
    label: "Other Lagos Mainland (Yaba, Surulere, Ikeja, Oshodi, etc.)",
  },
  {
    value: "island",
    label: "Lagos Island (Lekki, Ikoyi, VI, Ajah, etc.)",
  },
];

export const FREE_DELIVERY_THRESHOLD = 100_000;

const LAGOS_AREA_FEE: Record<LagosArea, number> = {
  alimosho: 1500,
  mainland: 2500,
  island: 3500,
};

type OtherZone =
  | "southwest"
  | "southsouth_southeast"
  | "northcentral"
  | "north";

// States outside Lagos, grouped by distance from Ikotun.
const STATE_ZONES: Record<string, OtherZone> = {
  Ogun: "southwest",
  Oyo: "southwest",
  Osun: "southwest",
  Ekiti: "southwest",
  Ondo: "southwest",

  Edo: "southsouth_southeast",
  Delta: "southsouth_southeast",
  Rivers: "southsouth_southeast",
  Bayelsa: "southsouth_southeast",
  "Cross River": "southsouth_southeast",
  "Akwa Ibom": "southsouth_southeast",
  Imo: "southsouth_southeast",
  Abia: "southsouth_southeast",
  Anambra: "southsouth_southeast",
  Enugu: "southsouth_southeast",
  Ebonyi: "southsouth_southeast",

  "FCT (Abuja)": "northcentral",
  Kwara: "northcentral",
  Kogi: "northcentral",
  Niger: "northcentral",
  Nasarawa: "northcentral",
  Benue: "northcentral",
  Plateau: "northcentral",

  Kano: "north",
  Kaduna: "north",
  Katsina: "north",
  Jigawa: "north",
  Kebbi: "north",
  Sokoto: "north",
  Zamfara: "north",
  Bauchi: "north",
  Gombe: "north",
  Adamawa: "north",
  Taraba: "north",
  Yobe: "north",
  Borno: "north",
};

const ZONE_FEE: Record<OtherZone, number> = {
  southwest: 3500,
  southsouth_southeast: 4500,
  northcentral: 4500,
  north: 0,
};

export function calculateDeliveryFee(params: {
  state: string;
  lagosArea?: LagosArea;
  subtotal: number;
}): number {
  const { state, lagosArea, subtotal } = params;

  if (subtotal >= FREE_DELIVERY_THRESHOLD) {
    return 0;
  }

  if (state === "Lagos") {
    return LAGOS_AREA_FEE[lagosArea ?? "mainland"];
  }

  const zone = STATE_ZONES[state];
  return zone ? ZONE_FEE[zone] : ZONE_FEE.north;
}