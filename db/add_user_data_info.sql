INSERT INTO dataInfo 
(username, user_id, title, file_type, subtopic, data_summary)
VALUES ($1,$2,$3,$4,$5,$6);

SELECT * FROM dataInfo
WHERE user_id = $2;