<code>./nuclei -target http://www.greatplacetowork.com/best/list-2000-ch.htm -rl 1 -dreq -p http://127.0.0.1:8080 | tee nuc.log</code>

<hr>
<h3>add extra themes</h3>
<code>git clone https://github.com/emadshanab/Nuclei-Templates-Collection.git
cd Nuclei-Templates-Collection
python3 bulk_clone_repos.py
#login with your git account ...
python3 remove_duplicated_templates.py
cd ..
./nuclei -t Nuclei-Templates-Collection/community-templates/im403__nuclei-temp/high/CVE-2018-13379.yaml -l endpoind-urls.txt
./nuclei -u https://my.target.site -t templates-35.txt

./nuclei -l endpoind-urls.txt -t cves/ -t Nuclei-Templates-Collection/community-templates
+/root/nuclei-templates</code>

<hr>
<a href='https://github.com/dewebdes/ZedAlert/blob/main/tools/cve/nuclei/universal.txt'>UNIVERSAL VARABLES</a>
<hr>
<a href="https://www.linkedin.com/posts/eyni-kave_aetaebaesaev-aepaeqaeaaepaez-aevagp-activity-7264008069435551745-7vXG">
<img src="https://github.com/dewebdes/ZedAlert/blob/main/tools/cve/nuclei/kali-linkos.jpeg">
</a>