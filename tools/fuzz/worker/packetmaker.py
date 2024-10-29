import collections
import os
import time
import xml.etree.ElementTree as ET
import base64

class bitem:
    def __init__(self, url, host, method, path, extension, mimetype, request, response):
        self.url = url
        self.host = host
        self.method = method
        self.path = path
        self.extension = extension
        self.mimetype = mimetype
        self.request = request
        self.response = response

def base64ToString(b):
    return b.decode("utf-8")
    #return base64.b64decode(b).decode('utf-8')

def current_milli_time():
    return round(time.time() * 1000)

def start(pt):
    print("search for " + pt)
    white_hosts = ['hiring.monster.com','appsapi.monster.io','tagmgr.monster.com','buy.monster.com','tagmgr.monster.lu','candidatehelp.monster.com','api.monster.io','hiring-identity.monster.com','manage.monster.co.uk','www.monster.lu','identity.monster.com','careers.monster.com','tagmgr.monster.co.uk','www.monster.com','manage.monster.com']
    feed = []
    tree = ET.parse('full.xml')
    root = tree.getroot()
    for item in root.findall('item'):
        url = item.find('url').text
        host = item.find('host').text
        method = item.find('method').text
        path = item.find('path').text
        extension = item.find('extension').text
        mimetype = item.find('mimetype').text
        request = item.find('request').text
        response = item.find('response').text

        if(method != "OPTIONS"):
            if str(pt) in str(url):
                if len(white_hosts) == 0:
                    feed.append(bitem(url, host, method, path, extension, mimetype, request, response))
                else:
                    if host in white_hosts:
                        feed.append(bitem(url, host, method, path, extension, mimetype, request, response))
    print(str(len(feed)))
    return feed

var = input("Please enter path: ")

ret = start(var)

new_list = sorted(ret, key=lambda x: x.url, reverse=True)
packetname = "packet" + "-" + str(current_milli_time())
os.makedirs(packetname)
indx = 0
for item in new_list:
    b64 = base64ToString(base64.b64decode(item.request))
    packetname2 = "packet" + "-" + str(current_milli_time()) + "-" + str(indx) + ".txt"
    f = open(packetname + "/" + packetname2, "a")
    f.write(str(b64))
    f.close()
    print("\n\n" + str(indx) + ": packet write to " + packetname + "/" + packetname2)
    b64 = base64ToString(base64.b64decode(item.response))
    packetname2 = "packet" + "-" + str(current_milli_time()) + "-" + str(indx) + "-response" + ".txt"
    f = open(packetname + "/" + packetname2, "a")
    f.write(str(b64))
    f.close()
    indx = indx + 1
