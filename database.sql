
CREATE TABLE activities (
    activity_id TEXT PRIMARY KEY,
    likes INTEGER DEFAULT 0,
    participants TEXT[] DEFAULT '{}'
);

-- Voeg voorbeeldactiviteiten toe
INSERT INTO activities (activity_id) VALUES
('karaoke'),
('voetbal'),
('pannenkoeken'),
('quiz'),
('filmavond');
