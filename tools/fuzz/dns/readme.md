<code>./mitmdump --set block_global=false --ssl-insecure -s multiproxy-injection-fat.py 1> /dev/null
./ffuf -u http://FUZZ.monster.com -w sub_rand_3000000_11582871.txt -x http://192.168.189.130:8080 -of json -o monster-sub-fuzz.json | tee monster-log-3M.ffuf

./subfinder -d monster.com | tee monster.subf

combine new-host.log not monster.subf | tee host.discover
</code>
