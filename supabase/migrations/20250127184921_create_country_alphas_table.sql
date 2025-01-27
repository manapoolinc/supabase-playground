CREATE TABLE country_alphas (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    country_id BIGINT NOT NULL UNIQUE REFERENCES countries(id),
    alpha2 TEXT NOT NULL UNIQUE,
    alpha3 TEXT NOT NULL UNIQUE
);

ALTER TABLE country_alphas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read country_alphas"
ON public.country_alphas
FOR SELECT TO anon
USING (TRUE);
