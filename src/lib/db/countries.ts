import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Database } from "$lib/db/schema";
import { createClient } from "@supabase/supabase-js";

type CountryData = {
  name: string;
  country_alphas: {
    alpha2: string;
    alpha3: string;
  };
};

export async function getCountries(): Promise<CountryData[]> {
  const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

  const { data: usResponse, error: usError } = await supabase
    .from("countries")
    .select(
      `
      name,
      country_alphas!inner (
        alpha2,
        alpha3
      )
      `
    )
    .eq("name", "United States")
    .single();
  if (usError) {
    console.error(usError);
    throw new Error("Failed to load data");
  }
  const usData: CountryData = usResponse;

  const { data: caResponse, error: caError } = await supabase
    .from("countries")
    .select(
      `
      name,
      country_alphas!inner (
        alpha2,
        alpha3
      )
      `
    )
    .eq("name", "Canada")
    .single();
  if (caError) {
    console.error(caError);
    throw new Error("Failed to load data");
  }
  /**
   * This line results in a type error because supabase fails to recognize the
   * computed field on the rpc select: https://postgrest.org/en/v12/references/api/computed_fields.html
   *
   * Returning a type of:
   * const caResponse: SelectQueryError<"column 'lowername' does not exist on 'country_from_alpha2'.">
   */
  const caData: CountryData = caResponse;

  return [usData, caData];
}
