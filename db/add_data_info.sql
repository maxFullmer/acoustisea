INSERT INTO dataInfo 
(username, user_id, title, file_type, marine_bio, vehicle, civil_egr, environmental, data_summary)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);

SELECT * FROM dataInfo
WHERE user_id = $2;