<h1>DOM XSS Detector</h1>
<h2>Install puppeteer</h2>
<code>sudo apt-get install chromium-browser</code>
<code>sudo apt-get install libx11-xcb1 libxcomposite1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6</code>
<code>sudo npm install -g puppeteer</code>
<hr>
<h2>
Customize detector.js
</h2>
<p>
set <strong>baseurl</strong> variable value.
</p>
<h2>Setup Packages</h2>
<code>npm install</code>
<hr>
<h2>Grab Best PARAMS List of your TARGET</h2>
<code>./fallparams -u TARGET
cat TARGET-urls.txt | ./unfurl keys | sort | uniq -u > wayparams.txt
#append wayparams to parameters.txt
#append 27 top xss to parameters.txt
cat parameters.txt | sort | uniq -u > params.txt</code>
<hr>
<h2>Start APP</h2>
<p>
set <strong>index.txt</strong> content to <strong>0</strong>
</p>
<p>
clean content of <strong>okpayloads.txt</strong>
</p>
<code>node detector.js</code>
