-- 02_rename_spaces.sql
-- Renames the `type` column in the `spaces` table to reflect cafe-friendly names

UPDATE spaces
SET type = 'Cafe Table'
WHERE type IN ('hot_desk', 'Hot Desk');

UPDATE spaces
SET type = 'Work Table'
WHERE type IN ('dedicated_desk', 'Dedicated Desk');

UPDATE spaces
SET type = 'Private Booth'
WHERE type IN ('private_cabin', 'Private Cabin');

UPDATE spaces
SET type = 'Group Table'
WHERE type IN ('meeting_room', 'Meeting Room');

UPDATE spaces
SET type = 'Event Area'
WHERE type IN ('conference_room', 'Conference Room');
