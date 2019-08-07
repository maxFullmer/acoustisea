UPDATE dataInfo
SET 
    title = $2,
    file_type = $3,
    marine_bio = $4,
    vehicle = $5,
    civil_egr = $6,
    environmental = $7,
    data_summary = $8
WHERE data_id = $1

RETURNING *;