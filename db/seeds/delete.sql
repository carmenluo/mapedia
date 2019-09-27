DELETE FROM pins;
-- DROP TABLE IF EXISTS maps
-- CASCADE;
CREATE TABLE maps
(
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT
  category VARCHAR
  (255);
  url VARCHAR
  (255);
  liked INTEGER
);
  INSERT INTO maps
    (owner_id, description, category, url, liked)
  VALUES(1, 'Sight-seeing sites to see while camping', "camping", "../public/img/camping.png", 10);
  INSERT INTO maps
    (owner_id, description, category, url, liked)
  VALUES(2, 'Sight-seeing sites to see while camping', "camping", 3);
  INSERT INTO maps
    (owner_id, description, category, url, liked)
  VALUES(3, 'Sight-seeing sites to see while camping', "camping", 5);
  INSERT INTO maps
    (owner_id, description, category, url, liked)
  VALUES(1, 'Sight-seeing sites to see while camping', "camping", 4);
  INSERT INTO maps
    (owner_id, description, category, url, liked)
  VALUES(1
  'Italian restaurants I''d like to eat at', "foody",4);
  (owner_id, description, category, url, liked)
VALUES
  (1, 'Italian restaurants I''d like to eat at', "foody", 8);
  (owner_id, description, category, url, liked)
VALUES
  (2, 'Italian restaurants I''d like to eat at', "foody", 10);
  (owner_id, description, category, url, liked)
VALUES
  (2, 'Italian restaurants I''d like to eat at', "foody", 12);
  (owner_id, description, category, url, liked)
VALUES
  (3, 'Italian restaurants I''d like to eat at', "foody", 2);
  INSERT INTO maps
    (owner_id, description, category, url, liked)
  VALUES(2, 'Wedding venues to scout out', "wedding", 3);
  INSERT INTO maps
    (owner_id, description, category, url, liked)
  VALUES(3, 'Wedding venues to scout out', "wedding", 4);
  INSERT INTO pins
    (longitude, latitude, map_id)
  VALUES
    (43.644114, 79.402328, 3);
  INSERT INTO pins
    (longitude, latitude, map_id)
  VALUES
    (43.644999, 79.400558, 2);
  INSERT INTO pins
    (longitude, latitude, map_id)
  VALUES
    (43.643470, 79.399206, 1);
  INSERT INTO pins
    (longitude, latitude, map_id)
  VALUES
    (44.643470, 79.399206, 1);
  INSERT INTO pins
    (longitude, latitude, map_id)
  VALUES
    (45.643470, 79.399206, 1);
  INSERT INTO pins
    (longitude, latitude, map_id)
  VALUES
    (46.643470, 79.399206, 1);

