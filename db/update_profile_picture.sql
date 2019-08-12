UPDATE users
SET profile_picture = $2
WHERE user_id = $1;

SELECT username, profile_picture, biography FROM users
WHERE user_id = $1;