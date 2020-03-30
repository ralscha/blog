1. npm install
2. ionic integrations enable cordova --add
3. ionic cordova prepare android
4. Compare <widget id="..." in config.xml with package name in Firebase file
5.
Add to config.xml 
<platform name="android">
    <resource-file src="google-services.json" target="app/google-services.json" />
    ...
</platform>

6. ionic cordova plugin add cordova-plugin-firebase-messaging
7. ionic cordova run android