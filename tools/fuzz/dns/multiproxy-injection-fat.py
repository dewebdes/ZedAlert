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
		self.num = self.num + 1
		if self.num > 30:
			self.num = 0
			
		print("http: " + flow.request.scheme)
		finalurl = "/?"
		finalurl += "dieuri=" + urllib.parse.quote_plus(flow.request.scheme + "://" + flow.request.host + flow.request.path) + "&diemet=" + flow.request.method
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
		dcok = cookstr
		if dcok == "":
			dcok = "null"
		dbod = flow.request.text
		if dbod == "":
			dbod = "null"
		else:
			dbod = urllib.parse.quote_plus(flow.request.text)
			
		finalurl += "&diehed=" + headstr + "&diecok=" + dcok + "&diebod=" + dbod 
		print(finalurl)
		print("\n\n")
		worker = "icy-hill-744d.linkoskali.workers.dev"
		match self.num:
			case 0:
				worker = "shiny-fog-4f85.xxxx-b64.workers.dev"
			case 1:
				worker = "winter-feather-xxxx.paoratts.workers.dev"
			case 2:
				worker = "square-snow-7750.xxxx.workers.dev"
			case 3:
				worker = "wild-king-77ce.xxxxe.workers.dev"
			case 4:
				worker = "royal-bird-b128.shexxxx.workers.dev"
			case 5:
				worker = "broken-hill-5af1.sxxxxl.workers.dev"
			case 6:
				worker = "tight-tree-468b.yaxxxx.workers.dev"
			case 7:
				worker = "steep-brook-0e4a.saxxxxxc.workers.dev"
			case 8:
				worker = "plain-surf-1826.sxxxxsh.workers.dev"
			case 9:
				worker = "young-resonance-7005.xxxxzerat.workers.dev"
			case 10:
				worker = "rough-voice-1227.shixxxx.workers.dev"
			case 11:
				worker = "long-thunder-3aa6.pexxxxb.workers.dev"
			case 12:
				worker = "rough-hill-552b.chexxxxo.workers.dev"
			case 13:
				worker = "bitter-poetry-fcde.hxxxxke.workers.dev"
			case 14:
				worker = "patient-recipe-f992.saatxxxx.workers.dev"
			case 15:
				worker = "holy-lake-4607.xxxxe.workers.dev"
			case 16:
				worker = "noisy-limit-cf43.dixxxxa.workers.dev"
			case 17:
				worker = "red-salad-98d8.yxxxx.workers.dev"
			case 18:
				worker = "autumn-sound-febd.taxxxxng.workers.dev"
			case 19:
				worker = "yellow-haze-8ff0.xxxxas.workers.dev"
			case 20:
				worker = "empty-cake-12ee.tazdaxxxx.workers.dev"
			case 21:
				worker = "young-tree-4c85.shxxxx.workers.dev"
			case 22:
				worker = "jolly-brook-d3c5.xxxxzib.workers.dev"
			case 23:
				worker = "icy-pine-41be.bxxxxhek.workers.dev"
			case 24:
				worker = "twilight-smoke-3837.xxxxm.workers.dev"
			case 25:
				worker = "jolly-cake-dfc2.xxxx.workers.dev"
			case 26:
				worker = "jolly-brook-451a.hafxxxx.workers.dev"
			case 27:
				worker = "bitter-flower-2eaa.xxxxingha.workers.dev"
			case 28:
				worker = "lingering-butterfly-e364.xxxxri.workers.dev"
			case 29:
				worker = "cold-frost-fc93.xxxxf.workers.dev"
			case 30:
				worker = "icy-hill-744d.xxxxi.workers.dev"

		flow.request.host = worker
		flow.request.path = finalurl
		flow.request.method = "GET"
		flow.request.port = 443
		flow.request.text = ""
		flow.request.scheme = "https"

		print(flow.request)

		
		upserv = "127.0.0.1"
		uport = 8082
		#address = (upserv, uport)
		#flow.server_conn = Server(flow.server_conn.address)
		#flow.server_conn.via = ServerSpec("http", address)
	    
addons = [multiproxy()]
