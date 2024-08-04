from mitmproxy import http
from mitmproxy.connection import Server
from mitmproxy.net.server_spec import ServerSpec
from mitmproxy import ctx

class multiproxy:

	def __init__(self):
		self.num = 0
		
	def request(self, flow) -> None:
		self.num = self.num + 1
		
		if self.num > 66:
			self.num = 0
			
		if self.num > 1:
			upserv = ""
			uport = 8080
			if self.num == 2:
				upserv = "95.216.87.126"
				uport = 8080
			if self.num == 3:
				upserv = "95.216.87.125"
				uport = 8080
			if self.num == 4:
				upserv = "95.216.87.124"
				uport = 8080
			if self.num == 5:
				upserv = "192.181.116.165"
				uport = 8080
			if self.num == 6:
				upserv = "95.216.87.96"
				uport = 3128
			if self.num == 7:
				upserv = "95.216.87.97"
				uport = 3128
			if self.num == 8:
				upserv = "95.216.87.98"
				uport = 3128
			if self.num == 9:
				upserv = "95.216.87.99"
				uport = 3128
			if self.num == 10:
				upserv = "95.216.87.100"
				uport = 3128
			if self.num == 11:
				upserv = "95.216.87.101"
				uport = 3128
			if self.num == 12:
				upserv = "95.216.87.102"
				uport = 3128
			if self.num == 13:
				upserv = "95.216.87.103"
				uport = 3128
			if self.num == 14:
				upserv = "95.216.87.104"
				uport = 3128
			if self.num == 15:
				upserv = "95.216.87.105"
				uport = 3128
			if self.num == 16:
				upserv = "95.216.87.106"
				uport = 3128
			if self.num == 17:
				upserv = "95.216.87.107"
				uport = 3128
			if self.num == 18:
				upserv = "95.216.87.108"
				uport = 3128
			if self.num == 19:
				upserv = "95.216.87.109"
				uport = 3128
			if self.num == 20:
				upserv = "95.216.87.110"
				uport = 3128
			if self.num == 21:
				upserv = "95.216.87.111"
				uport = 3128
			if self.num == 22:
				upserv = "95.216.87.112"
				uport = 3128
			if self.num == 23:
				upserv = "95.216.87.113"
				uport = 3128
			if self.num == 24:
				upserv = "95.216.87.114"
				uport = 3128
			if self.num == 25:
				upserv = "95.216.87.115"
				uport = 3128
			if self.num == 26:
				upserv = "95.216.87.116"
				uport = 3128
			if self.num == 27:
				upserv = "95.216.87.117"
				uport = 3128
			if self.num == 28:
				upserv = "95.216.87.118"
				uport = 3128
			if self.num == 29:
				upserv = "95.216.87.119"
				uport = 3128
			if self.num == 30:
				upserv = "95.216.87.120"
				uport = 3128
			if self.num == 31:
				upserv = "95.216.87.121"
				uport = 3128
			if self.num == 32:
				upserv = "95.216.87.122"
				uport = 3128
			if self.num == 33:
				upserv = "95.216.87.123"
				uport = 3128
			if self.num == 34:
				upserv = "95.216.87.124"
				uport = 3128
			if self.num == 35:
				upserv = "95.216.87.125"
				uport = 3128
			if self.num == 36:
				upserv = "95.216.87.126"
				uport = 3128
			if self.num == 37:
				upserv = "95.217.79.193"
				uport = 3128
			if self.num == 38:
				upserv = "95.217.79.194"
				uport = 3128
			if self.num == 39:
				upserv = "95.217.79.195"
				uport = 3128
			if self.num == 40:
				upserv = "95.217.79.196"
				uport = 3128
			if self.num == 41:
				upserv = "95.217.79.197"
				uport = 3128
			if self.num == 42:
				upserv = "95.217.79.198"
				uport = 3128
			if self.num == 43:
				upserv = "95.217.79.199"
				uport = 3128
			if self.num == 44:
				upserv = "95.217.79.200"
				uport = 3128
			if self.num == 45:
				upserv = "95.217.79.201"
				uport = 3128
			if self.num == 46:
				upserv = "95.217.79.202"
				uport = 3128
			if self.num == 47:
				upserv = "95.217.79.220"
				uport = 3128
			if self.num == 48:
				upserv = "95.217.79.204"
				uport = 3128
			if self.num == 49:
				upserv = "95.217.79.205"
				uport = 3128
			if self.num == 50:
				upserv = "95.217.79.206"
				uport = 3128
			if self.num == 51:
				upserv = "95.217.79.207"
				uport = 3128
			if self.num == 52:
				upserv = "95.217.79.208"
				uport = 3128
			if self.num == 53:
				upserv = "95.217.79.209"
				uport = 3128
			if self.num == 54:
				upserv = "95.217.79.210"
				uport = 3128
			if self.num == 55:
				upserv = "95.217.79.211"
				uport = 3128
			if self.num == 56:
				upserv = "95.217.79.212"
				uport = 3128
			if self.num == 57:
				upserv = "95.217.79.213"
				uport = 3128
			if self.num == 58:
				upserv = "95.217.79.214"
				uport = 3128
			if self.num == 59:
				upserv = "95.217.79.215"
				uport = 3128
			if self.num == 60:
				upserv = "95.217.79.216"
				uport = 3128
			if self.num == 61:
				upserv = "95.217.79.217"
				uport = 3128
			if self.num == 62:
				upserv = "95.217.79.218"
				uport = 3128
			if self.num == 63:
				upserv = "95.217.79.219"
				uport = 3128
			if self.num == 64:
				upserv = "95.217.79.220"
				uport = 3128
			if self.num == 65:
				upserv = "95.217.79.221"
				uport = 3128
			if self.num == 66:
				upserv = "95.217.79.222"
				uport = 3128
				
			#ctx.log.info("request to :> " + upserv)
			address = (upserv, uport)
			flow.server_conn = Server(flow.server_conn.address)
			flow.server_conn.via = ServerSpec("http", address)
	    
addons = [multiproxy()]
