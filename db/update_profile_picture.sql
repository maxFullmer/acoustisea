UPDATE users
SET profile_picture = $2
WHERE user_id = $1;

SELECT profile_picture FROM users
WHERE user_id = $1;