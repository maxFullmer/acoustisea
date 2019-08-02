INSERT INTO dataInfo 
(username, user_id, title, file_type, marineBio, vehicle, civilEgr, environmental, data_summary)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)

returning *;