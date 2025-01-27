CREATE TABLE country_alpha_locations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    alpha2 TEXT NOT NULL UNIQUE,
    location TEXT NOT NULL
);

ALTER TABLE country_alpha_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read country_alpha_locations"
ON public.country_alpha_locations
FOR SELECT TO anon
USING (TRUE);
