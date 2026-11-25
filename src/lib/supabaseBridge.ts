export interface SupabaseEnvConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseEnvConfig(): SupabaseEnvConfig {
  const url =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) ||
    '';
  const anonKey =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY) ||
    '';

  const isConfigured =
    Boolean(url) &&
    Boolean(anonKey) &&
    !url.includes('your-project-ref') &&
    !anonKey.includes('your-supabase-anon-key');

  return { url, anonKey, isConfigured };
}

export interface SupabaseRestResponse<T> {
  data: T | null;
  error: string | null;
  source: 'supabase' | 'local-fallback';
}

export async function supabaseSelect<T>(
  table: string,
  query = 'select=*',
  accessToken?: string
): Promise<SupabaseRestResponse<T[]>> {
  const { url, anonKey, isConfigured } = getSupabaseEnvConfig();
  if (!isConfigured) {
    return { data: null, error: null, source: 'local-fallback' };
  }

  try {
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken || anonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return {
        data: null,
        error: `Supabase query failed (${res.status})`,
        source: 'local-fallback',
      };
    }

    const rows = (await res.json()) as T[];
    return { data: rows, error: null, source: 'supabase' };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
      source: 'local-fallback',
    };
  }
}

export async function supabaseInsert<T extends Record<string, unknown>>(
  table: string,
  payload: T,
  accessToken?: string
): Promise<SupabaseRestResponse<T>> {
  const { url, anonKey, isConfigured } = getSupabaseEnvConfig();
  if (!isConfigured) {
    return { data: payload, error: null, source: 'local-fallback' };
  }

  try {
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken || anonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        data: payload,
        error: `Supabase insert failed (${res.status})`,
        source: 'local-fallback',
      };
    }

    const rows = (await res.json()) as T[];
    return { data: rows[0] ?? payload, error: null, source: 'supabase' };
  } catch (err) {
    return {
      data: payload,
      error: err instanceof Error ? err.message : 'Network error',
      source: 'local-fallback',
    };
  }
}