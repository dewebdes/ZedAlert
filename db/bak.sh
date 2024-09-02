cd /zalert//db
sqlfile="zalert_"$(date +"%Y_%m_%d_%I_%M_%p")".sql"
mysqldump -uroot --password="..." -R -E --single-transaction --databases zalert > $sqlfile
