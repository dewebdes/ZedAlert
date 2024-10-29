import collections
import xml.etree.ElementTree as ET
from datetime import datetime
import sys
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

class oitem:
    def __init__(self, url, ascii, status, packet):
        self.url = url
        self.ascii = ascii
        self.status = status
        self.packet = packet
        
#white_hosts = ['hiring.monster.com','appsapi.monster.io','tagmgr.monster.com','buy.monster.com','tagmgr.monster.lu','candidatehelp.monster.com','api.monster.io','hiring-identity.monster.com','manage.monster.co.uk','www.monster.lu','identity.monster.com','careers.monster.com','tagmgr.monster.co.uk','www.monster.com','manage.monster.com']
white_hosts = []

feed = []

input = sys.argv[1]


tree = ET.parse(input)
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
    if len(white_hosts) == 0:
        feed.append(bitem(url, host, method, path, extension, mimetype, request, response))
    else:
        if host in white_hosts:
            feed.append(bitem(url, host, method, path, extension, mimetype, request, response))



distinct_by_url = set()
for obj in feed:
    distinct_by_url.add(obj.url)

distinct_counter_url = collections.Counter(distinct_by_url)
distinct_list_url = [element for element, count in distinct_counter_url.items() if count == 1]
distinct_list_url.sort()

now = datetime.now() 
date_time = now.strftime("%m%d%Y%H%M%S")
ofn = 'url-' + date_time
with open(ofn, 'w') as f:
    for line in distinct_list_url:
        f.write(line)
        f.write('\n')

print(str(len(distinct_list_url)) + ' url count. saved in ' + ofn + "\n")

#####################################################################################

distinct_by_url_ascii = set()
for obj in feed:
    firstparam = obj.url.split('?')[1].split("&")[0]
    print(firstparam + "\n")
    if ("ascii=" in firstparam):
        ascii = firstparam.split("=")[1]
        resp_byte = bytearray()
        resp_byte.extend(map(ord, obj.response))
        resp = resp_byte.decode("ascii")
        resp2 = base64.b64decode(resp).decode("utf-8")
        print(resp2)
        status = (resp2.splitlines()[0].split(" ")[1])
        distinct_by_url_ascii.add(oitem(obj.url,ascii,status,resp2))

new_list = sorted(distinct_by_url_ascii, key=lambda x: x.status, reverse=True)

#distinct_counter_url = collections.Counter(distinct_by_url_fuzz)
#distinct_list_url = [element for element, count in distinct_counter_url.items() if count == 1]
#distinct_list_url.sort()

o2fn = 'fuzz-ascii-' + date_time
with open(o2fn, 'w') as f:
    for line in new_list:
        print(line.ascii + " - " + line.status)
        try:
            f.write((line.status) + " : ASCII = " + line.ascii + " === " + ''.join(map(chr,[line.ascii.split("-")[0]])))
        except:
            f.write((line.status) + " : ASCII = " + line.ascii + " === " + line.url)# + " === " + ''.join(map(chr,[line.ascii.split("-")[0]])))
        f.write('\n')

print(str(len(distinct_by_url_ascii)) + ' ascii count saved in ' + o2fn)
