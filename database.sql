
CREATE TABLE IF NOT EXISTS activities (
    activity_id TEXT PRIMARY KEY,
    likes INTEGER DEFAULT 0,
    participants TEXT[] DEFAULT '{}'
);

INSERT INTO activities (activity_id) VALUES
('tapasavond'),
('hitster'),
('karaoke'),
('voetbal'),
('pannenkoeken'),
('quiz'),
('filmavond'),
('sjoelen'),
('bios'),
('zaterdagspel'),
('pubquiz')
ON CONFLICT DO NOTHING;
