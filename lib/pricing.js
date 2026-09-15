import { getSupabaseClient, isSupabaseConfigured } from "./supabase.js";

/**
 * Default products and prices (used as baseline and fallback when Supabase is not configured).
 */
const DEFAULT_PRICES = {
  interview: {
    id: "interview",
    name: "AI Mock Interview",
    description: "AI Mock Interview — 15-minute session",
    amount: 9.99,
    currency: "usd",
    updated_at: new Date().toISOString(),
  },
  "cv-package": {
    id: "cv-package",
    name: "Complete CV Package",
    description: "Professional CV Preparation & Career Services",
    amount: 24.00,
    currency: "usd",
    updated_at: new Date().toISOString(),
  },
};

// In-memory runtime cache for fallback mode
const inMemoryStore = { ...DEFAULT_PRICES };

/**
 * Validates product ID and returns the server-side trusted price object.
 * NEVER trusts the client-provided amount.
 *
 * @param {string} productId - 'interview' or 'cv-package'
 * @returns {Promise<{ id: string, name: string, description: string, amount: number, currency: string, source: 'supabase' | 'fallback' }>}
 */
export async function getProductPrice(productId) {
  const cleanId = String(productId || "").trim();
  if (!cleanId || !DEFAULT_PRICES[cleanId]) {
    throw new Error(`Invalid or unrecognized product ID: "${productId}". Available products: ${Object.keys(DEFAULT_PRICES).join(", ")}`);
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("prices")
        .select("id, name, description, amount, currency, updated_at")
        .eq("id", cleanId)
        .single();

      if (!error && data && data.amount > 0) {
        return {
          id: data.id,
          name: data.name || DEFAULT_PRICES[cleanId].name,
          description: data.description || DEFAULT_PRICES[cleanId].description,
          amount: Number(data.amount),
          currency: data.currency || "usd",
          updated_at: data.updated_at,
          source: "supabase",
        };
      }
      if (error) {
        console.warn(`[pricing] Supabase query for ${cleanId} returned error:`, error.message);
      }
    } catch (err) {
      console.warn(`[pricing] Error fetching ${cleanId} from Supabase:`, err.message);
    }
  }

  // Fallback to in-memory store
  const fallback = inMemoryStore[cleanId] || DEFAULT_PRICES[cleanId];
  return {
    ...fallback,
    amount: Number(fallback.amount),
    source: "fallback",
  };
}

/**
 * Retrieves all product prices (combines Supabase with defaults).
 *
 * @returns {Promise<{ products: Array<object>, isConnectedToSupabase: boolean }>}
 */
export async function getAllPrices() {
  const supabase = getSupabaseClient();
  let supabaseConnected = false;
  const result = { ...inMemoryStore };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("prices")
        .select("id, name, description, amount, currency, updated_at");

      if (!error && Array.isArray(data)) {
        supabaseConnected = true;
        for (const item of data) {
          if (item.id && item.amount > 0) {
            result[item.id] = {
              id: item.id,
              name: item.name || DEFAULT_PRICES[item.id]?.name || item.id,
              description: item.description || DEFAULT_PRICES[item.id]?.description || "",
              amount: Number(item.amount),
              currency: item.currency || "usd",
              updated_at: item.updated_at,
              source: "supabase",
            };
          }
        }
      } else if (error) {
        console.warn("[pricing] Failed to fetch prices from Supabase:", error.message);
      }
    } catch (err) {
      console.warn("[pricing] Supabase error during getAllPrices:", err.message);
    }
  }

  return {
    products: Object.values(result),
    isConnectedToSupabase: supabaseConnected,
  };
}

/**
 * Updates the price for a product.
 * Requires positive numeric amount.
 *
 * @param {string} productId - 'interview' or 'cv-package'
 * @param {number|string} newAmount - e.g. 19.99
 * @returns {Promise<object>} Updated product
 */
export async function updateProductPrice(productId, newAmount) {
  const cleanId = String(productId || "").trim();
  if (!cleanId || !DEFAULT_PRICES[cleanId]) {
    throw new Error(`Cannot update unknown product: "${productId}".`);
  }

  const numericAmount = Number(parseFloat(newAmount));
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error("Invalid price: amount must be a positive number greater than 0.");
  }

  const roundedAmount = Math.round(numericAmount * 100) / 100;
  const now = new Date().toISOString();

  // Always update in-memory
  inMemoryStore[cleanId] = {
    ...DEFAULT_PRICES[cleanId],
    amount: roundedAmount,
    updated_at: now,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("prices")
      .upsert({
        id: cleanId,
        name: DEFAULT_PRICES[cleanId].name,
        description: DEFAULT_PRICES[cleanId].description,
        amount: roundedAmount,
        currency: "usd",
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      const friendlyMsg = formatSupabaseError(error);
      console.error("[pricing] Failed to save updated price to Supabase:", friendlyMsg);
      throw new Error(`Database error: ${friendlyMsg}. Price was updated in temporary memory only.`);
    }

    return {
      ...data,
      amount: Number(data.amount),
      source: "supabase",
    };
  }

  return {
    ...inMemoryStore[cleanId],
    source: "fallback",
    note: "Saved in memory. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to persist across server restarts.",
  };
}

/**
 * Formats raw Supabase errors into human-friendly explanations.
 */
function formatSupabaseError(error) {
  if (!error) return "Unknown database error.";
  const rawMsg = typeof error === "string" ? error : (error.message || JSON.stringify(error));

  if (rawMsg.includes("<!DOCTYPE") || rawMsg.includes("<html") || rawMsg.includes("404")) {
    return "Invalid Supabase Project URL. In your Supabase Dashboard, navigate to Project Settings -> API and copy the 'Project URL' (format: https://<project-ref>.supabase.co), NOT the browser dashboard URL.";
  }

  if (rawMsg.includes("relation") && rawMsg.includes("does not exist")) {
    return "The 'prices' table does not exist in Supabase yet. Please run the SQL in supabase-schema.sql in your Supabase SQL Editor.";
  }

  if (rawMsg.includes("JWT") || rawMsg.includes("apikey") || rawMsg.includes("invalid key") || rawMsg.includes("unauthorized")) {
    return "Invalid Supabase Service Role Key. In Supabase Dashboard -> Settings -> API, copy the 'service_role' secret key (NOT the anon key).";
  }

  return rawMsg;
}
