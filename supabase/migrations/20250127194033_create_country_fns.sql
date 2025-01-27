CREATE OR REPLACE FUNCTION country_alpha_locations(COUNTRIES)
RETURNS SETOF COUNTRY_ALPHA_LOCATIONS ROWS 1
STABLE PARALLEL SAFE RETURNS NULL ON NULL INPUT
LANGUAGE sql
AS $function$
    SELECT country_alpha_locations.*
    FROM country_alpha_locations
    INNER JOIN country_alphas ON country_alpha_locations.alpha2 = country_alphas.alpha2
    WHERE country_alphas.country_id = $1.id;
$function$;
