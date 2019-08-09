SELECT * FROM dataInfo
WHERE dataInfo.subtopic = $1
ORDER BY upload_date DESC;