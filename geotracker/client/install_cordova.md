npm install
ionic integrations enable cordova --add
ionic cordova plugin add @mauron85/cordova-plugin-background-geolocation
ionic cordova plugin add cordova-plugin-geolocation

add workaround
```
    <platform name="android">
        ...
        <resource-file src="resources/android/icon/drawable-xxxhdpi-icon.png" target="app/src/main/res/mipmap/icon.png" />
    </platform>
```

ionic cordova run android