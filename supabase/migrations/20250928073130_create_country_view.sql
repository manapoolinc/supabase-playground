CREATE MATERIALIZED VIEW countries_view AS (
    SELECT *
    FROM
        (
            VALUES
            (10, 'Canada'),
            (11, 'United States'),
            (12, 'Mexico')
        )
        AS t (id, name)
);

CREATE OR REPLACE FUNCTION countries(COUNTRIES_VIEW)
RETURNS SETOF COUNTRIES ROWS 1
STABLE PARALLEL SAFE CALLED ON NULL INPUT
LANGUAGE sql
AS $function$
    SELECT * FROM countries WHERE name = $1.name;
$function$;
