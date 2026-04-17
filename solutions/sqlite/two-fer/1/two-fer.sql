-- Schema: CREATE TABLE "twofer" ("input" TEXT, "response" TEXT);
-- Task: update the twofer table and set the response based on the input.

-- CREATE TABLE twofer(
--     input TEXT,
--     response TEXT,
-- );

UPDATE twofer
SET response = CASE
    WHEN input IS NULL OR input = '' THEN 'One for you, one for me.'
    else 'One for ' || input || ', one for me.'
END;

