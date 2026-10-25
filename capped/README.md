Source code for the blog posts: 
  * https://blog.rasc.ch/2018/02/Working-with-MongoDB-Capped-Collections-from-Java.html
  * https://blog.rasc.ch/2018/02/Working-with-MongoDB-TTL-Indexes-from-Java.html

## MongoDB 8 to 9 upgrade

For an existing standalone deployment, stop application writers first and take
both a verified `mongodump --archive` backup and a stopped-volume backup before
replacing the image. Keep the old volume and backups until validation is complete.

While MongoDB 8 is still running, check its feature compatibility version:

```javascript
db.adminCommand({ getParameter: 1, featureCompatibilityVersion: 1 })
```

It must report 8.0 for an 8.0 deployment. Shut down MongoDB cleanly, pull the new
image, then recreate only the database service using the same data volume.
Check startup logs, application reads/writes, collection counts, indexes, and any
capped collection options. Leave the old feature compatibility setting during
the initial validation period. After accepting the new deployment, enable 9.0:

```javascript
db.adminCommand({ setFeatureCompatibilityVersion: "9.0", confirm: true })
```

Never run `docker compose down -v` as an upgrade step. If your old configuration
used an anonymous volume, first identify it with `docker inspect` and explicitly
reattach it, or restore the logical backup into a fresh named volume. Do not
assume recreation automatically retains anonymous storage.

For rollback, stop the new database and restore the pre-upgrade backup into a
separate volume with MongoDB 8. Do not point the old binary at upgraded files.
Replica sets and sharded deployments require their own rolling procedures.
See the [official standalone upgrade procedure](https://www.mongodb.com/docs/manual/release-notes/9.0-upgrade-standalone/).
