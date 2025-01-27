import { getCountries } from "$lib/db/countries";

export const load = async () => {
  const countryData = await getCountries();
  const countries = countryData.reduce(
    (acc, country) => {
      acc[country.country_alphas.alpha2] = country;
      return acc;
    },
    {} as Record<string, (typeof countryData)[number]>
  );

  return {
    countries
  };
};
