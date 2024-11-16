from mitmproxy import http
from mitmproxy.connection import Server
from mitmproxy.net.server_spec import ServerSpec
from mitmproxy import ctx
import urllib.parse

#./mitmweb --set block_global=false --ssl-insecure -s multiproxy-injection.py

class headobj:
    def __init__(self, name, val):
        self.name = name
        self.val = val

class multiproxy:

	def __init__(self):
		self.num = 0
		
		
	def request(self, flow) -> None:
		print("http: " + flow.request.scheme)
		finalurl = "/?"
		finalurl += "dieuri=" + urllib.parse.quote_plus("https://" + flow.request.host + flow.request.path) + "&diemet=" + flow.request.method
		print("\n\nFLOW: \n")
		print(flow.request)
		print("\n\n=============\n\n")
		#print(flow.request) flow.request.text
		#print("print1: " + flow.request.method + " " + flow.request.path)# + " " + flow.request.path + " " + flow.request.http_version)
		#safe_string = urllib.parse.quote_plus(flow.request.path)
		#print(type(flow.request.headers.items()))
		headlist = []
		cookstr = ""
		for k, v in flow.request.headers.items():
			if(k.upper() != "COOKIE"):
				headlist.append(headobj(k.upper(), urllib.parse.quote_plus(v)))
			else:
				cookstr = urllib.parse.quote_plus(v)
			#print("%-20s: %s" % (k.upper(), v))
		headstr = "nndd".join((str(x.name) + "nnpp" + str(x.val)) for x in headlist)
		finalurl += "&diehed=" + headstr + "&diecok=" + cookstr + "&diebod=" + urllib.parse.quote_plus(flow.request.text) 
		print(finalurl)
		print("\n\n")


		flow.request.host = "throbbing-haze-xxx.xxx.workers.dev"
		flow.request.path = finalurl
		flow.request.method = "GET"
		flow.request.port = 443
		flow.request.text = ""
		flow.request.scheme = "https"

		print(flow.request)

		#self.num = self.num + 1
		upserv = "127.0.0.1"
		uport = 8082
		address = (upserv, uport)
		flow.server_conn = Server(flow.server_conn.address)
		flow.server_conn.via = ServerSpec("http", address)
	    
addons = [multiproxy()]
