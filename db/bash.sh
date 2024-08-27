#!/bin/bash
mysql -N -uroot -pPASS -hlocalhost -Dzalert -e "SELECT id,CONVERT(FROM_BASE64(addr) USING utf8) as url FROM endpoints WHERE FROM_BASE64(addr) LIKE '%yelp%biz%' order by FROM_BASE64(addr) desc" | while read url;
do 
echo $url
done