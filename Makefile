.PHONY: check-dep
check-dep:
	cd ./background-sync/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./background-sync/client && ncu
	cd ./background-sync/clientng && ncu
	cd ./beacon && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./capped && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./customicons4 && ncu
	cd ./datefns && ncu
	cd ./dexiejs && ncu
	cd ./dynamicpos/client && ncu
	cd ./dynamicpos/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./echarts && ncu
	cd ./geotracker/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./geotracker/client && ncu
	cd ./googlevision/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./googlevision/client && ncu
	cd ./indexeddb && ncu
	cd ./jwt/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./jwt/client && ncu
	cd ./lovefield && ncu
	cd ./minio && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./ngerrorhandler/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./ngerrorhandler/client && ncu
	cd ./ngworkbox && ncu
	cd ./parcelmaven && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./parcelmaven/src/main/frontend && ncu
	cd ./passwordcheck/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./passwordcheck/client && ncu
	cd ./pluggable-fs && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./poll/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./poll/client && ncu
	cd ./protobuf && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./protobuf-js/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./protobuf-js/client && ncu
	cd ./push/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./push/client && ncu
	cd ./pwmanager/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./pwmanager/client && ncu
	cd ./pwnd && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./rss && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./secure-todo && ncu
	cd ./secure-todo-asm && ncu
	cd ./speechsearch/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./speechsearch/client && ncu
	cd ./sse && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./sse-client && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./swagger/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./swagger/client && ncu
	cd ./sw-cache && ncu
	cd ./sw-push && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./text2speech/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./text2speech/client && ncu
	cd ./twolegged && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./uploadflowjs/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./uploadflowjs/client && ncu
	cd ./upload-minio/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./upload-minio/client && ncu
	cd ./uploadsb/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./uploadsb/client && ncu
	cd ./validation/server && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
	cd ./validation/client && ncu
	cd ./verbalregex && ./mvnw.cmd versions:display-dependency-updates && ./mvnw.cmd versions:display-plugin-updates
