-- Insert some countries
INSERT INTO countries (name)
VALUES
('Canada'),
('United States'),
('Mexico');


-- Insert some country alphas
INSERT INTO country_alphas (country_id, alpha2, alpha3)
SELECT
    id,
    'CA' AS alpha2,
    'CAN' AS alpha3
FROM countries
WHERE name = 'Canada'

UNION ALL
SELECT
    id,
    'US' AS alpha2,
    'USA' AS alpha3
FROM countries
WHERE name = 'United States'

UNION ALL
SELECT
    id,
    'MX' AS alpha2,
    'MEX' AS alpha3
FROM countries
WHERE name = 'Mexico';

-- Insert some country alpha locations
INSERT INTO country_alpha_locations (alpha2, location)
VALUES
('CA', 'North North America'),
('US', 'Mid North America'),
('MX', 'South North America');
