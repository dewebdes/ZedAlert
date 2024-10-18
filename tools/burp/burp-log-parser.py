import collections
import xml.etree.ElementTree as ET

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

#white_hosts = ['www.torfs.be','service.force.com']
white_hosts = []

feed = []
tree = ET.parse('logger001.xml')
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


############################## find distinct hosts ##############################

if len(white_hosts) == 0:    
    distinct_by_host = set()
    for obj in feed:
        distinct_by_host.add(obj.host)

    distinct_counter_host = collections.Counter(distinct_by_host)
    distinct_list_host = [element for element, count in distinct_counter_host.items() if count == 1]

    with open('hosts.txt', 'w') as f:
        for line in distinct_list_host:
            f.write(line)
            f.write('\n')

print('hosts file write.')

##################################################################################

print(str(len(feed)) + ' feeds count.')

distinct_by_url = set()
for obj in feed:
    distinct_by_url.add(obj.url)

distinct_counter_url = collections.Counter(distinct_by_url)
distinct_list_url = [element for element, count in distinct_counter_url.items() if count == 1]
distinct_list_url.sort()

with open('url.txt', 'w') as f:
    for line in distinct_list_url:
        f.write(line)
        f.write('\n')

print(str(len(distinct_list_url)) + ' url count.')

#####################################################################################

distinct_by_url = set()
for obj in feed:
    if(obj.method == "GET"):
        distinct_by_url.add(obj.url)

distinct_counter_url = collections.Counter(distinct_by_url)
distinct_list_url = [element for element, count in distinct_counter_url.items() if count == 1]
distinct_list_url.sort()

with open('url-get.txt', 'w') as f:
    for line in distinct_list_url:
        f.write(line)
        f.write('\n')

print(str(len(distinct_list_url)) + ' GET url count.')

#####################################################################################

distinct_by_url = set()
for obj in feed:
    if(obj.method == "POST"):
        distinct_by_url.add(obj.url)

distinct_counter_url = collections.Counter(distinct_by_url)
distinct_list_url = [element for element, count in distinct_counter_url.items() if count == 1]
distinct_list_url.sort()

with open('url-post.txt', 'w') as f:
    for line in distinct_list_url:
        f.write(line)
        f.write('\n')

print(str(len(distinct_list_url)) + ' POST url count.')

#####################################################################################

distinct_by_url = set()
for obj in feed:
    distinct_by_url.add(obj.url.split('?')[0])

distinct_counter_url = collections.Counter(distinct_by_url)
distinct_list_url = [element for element, count in distinct_counter_url.items() if count == 1]
distinct_list_url.sort()

with open('path.txt', 'w') as f:
    for line in distinct_list_url:
        f.write(line)
        f.write('\n')

print(str(len(distinct_list_url)) + ' path count.')

