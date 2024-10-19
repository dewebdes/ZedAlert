<h1>MITM Proxy</h1>

1.	Rent an IP range from your target CDN and setup them in your netplan:<br>
[01-netcfg.yaml](https://github.com/dewebdes/ZedAlert/blob/main/tools/proxy/01-netcfg.yaml)
<br><br>
2.	Download mitmproxy, mitmweb, mitmdump:<br>
[ZedAlert/tools/proxy at (github.com)](https://github.com/dewebdes/ZedAlert/tree/main/tools/proxy)
<br><br>
3.	Install SQUID proxy server and config IP range on it:<br>
[ZedAlert/tools/proxy/squid.conf at (github.com)](https://github.com/dewebdes/ZedAlert/blob/main/tools/proxy/squid.conf)
<br><br>
4.	Write a python script to handle IP range in mitm:<br>
 [ZedAlert/tools/proxy/multiproxy.py at (github.com)](https://github.com/dewebdes/ZedAlert/blob/main/tools/proxy/multiproxy.py)
<br><br>
5.	./mitmdump --set block_global=false --ssl-insecure -s multiproxy.py &
