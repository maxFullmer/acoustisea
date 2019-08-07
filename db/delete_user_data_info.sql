DELETE FROM dataInfo
WHERE user_id = $1 AND data_id = $2;

SELECT * FROM dataInfo
WHERE user_id = $1;