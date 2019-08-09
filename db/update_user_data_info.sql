UPDATE dataInfo
SET 
    title = $2,
    file_type = $3,
    subtopic = $4,
    data_summary = $5
WHERE user_id = $6 AND data_id = $1

RETURNING *;