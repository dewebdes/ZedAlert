cd /zalert
cd db
./bak.sh
pm2 start bak.js
cd ..
cd app
node app-1-spider
node app-0-programs
node app-2-programcap
node app-3-traget
pm2 start app-4-waybak
pm2 start app-5-endpoint