import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import type { Database } from "$lib/db/schema";
import { createClient } from "@supabase/supabase-js";

type CountryData = {
  name: string;
  country_alphas: {
    alpha2: string;
    alpha3: string;
  };
  country_alpha_locations?: {
    location: string;
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
      ),
      country_alpha_locations!inner (
        location
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
   * The next line results in a type error because supabase fails to recognize the
   * computed relationship: https://postgrest.org/en/v12/references/api/resource_embedding.html#computed-relationships
   *
   * Returning a type of:
   * const caResponse: {
   *   name: string;
   *   lowername: string | null;
   *   country_alphas: {
   *     alpha2: string;
   *     alpha3: string;
   *   };
   *   country_alpha_locations: SelectQueryError<"could not find the relation between countries and country_alpha_locations">;
   * }
   *
   * Note, supabase-js<=2.47.7 returned a type of, which is closer but still wrong:
   * const usResponse: {
   *   name: string;
   *   lowername: string | null;
   *   country_alphas: {
   *     alpha2: string;
   *     alpha3: string;
   *   };
   *   country_alpha_locations: {
   *     location: string;
   *     lowerlocation: string | null;
   *   }[]; // <-- The result should not be an array
   * }
   *
   * In actuality, supabase is returning:
   * const usResponse: {
   *   name: string;
   *   lowername: string | null;
   *   country_alphas: {
   *     alpha2: string;
   *     alpha3: string;
   *   };
   *   country_alpha_locations: {
   *     location: string;
   *     lowerlocation: string | null;
   *   };
   * }
   */
  const caData: CountryData = caResponse;

  return [usData, caData];
}

export async function getCountriesView(): Promise<CountryData[]> {
  const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

  const { data: usResponse, error: usError } = await supabase
    .from("countries_view")
    .select(
      `
      id,
      ...countries!inner (
        name,
        country_alphas!inner (
          alpha2,
          alpha3
        )
      )
      `
    )
    .eq("name", "United States")
    .single();
  if (usError) {
    console.error(usError);
    throw new Error("Failed to load data");
  }
  /**
   * The next line should work but instead fails because usResponse is typed as
   *
   * ```
   * const usResponse: {
   *   id: number | null;
   *   countries: SelectQueryError<"could not find the relation between countries_view and countries">;
   * }
   * ```
   *
   * Due to a failure of supabase to recognize the join function between countries_view and countries
   */
  const usData: CountryData = usResponse;

  const { data: caResponse, error: caError } = await supabase
    .from("countries_view")
    .select(
      `
      id,
      ...countries!inner (
        name,
        country_alphas!inner (
          alpha2,
          alpha3
        ),
        country_alpha_locations!inner (
          location
        )
      )
      `
    )
    .eq("name", "Canada")
    .single();
  if (caError) {
    console.error(caError);
    throw new Error("Failed to load data");
  }
  const caData: CountryData = caResponse;

  const { data: mexResponse, error: mexError } = await supabase
    .from("countries")
    .select(
      `
      id,
      ...countries_view!inner(
        name
      ),
      country_alphas!inner (
        alpha2,
        alpha3
      ),
      country_alpha_locations!inner (
        location
      )
      `
    )
    .eq("name", "Mexico")
    .single();
  if (mexError) {
    console.error(mexError);
    throw new Error("Failed to load data");
  }
  /**
   * This is expected to error while trying to assign string | null to string
   * because postgres refuses to know whether view columns are non-nullable.
   *
   * Any other error is a failure of supabase to recognize the join function
   * between countries and countries_view
   */
  const mexData: CountryData = mexResponse;

  return [usData, caData, mexData];
}
