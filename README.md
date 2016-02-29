# Harvest Time Reporting

*Env vars:*

* `HARVEST_SUBDOMAIN`
* `HARVEST_EMAIL`
* `HARVEST_PASSWORD`

Put these in a `.env` file like so.

```console
HARVEST_SUBDOMAIN="your-subdomain"
HARVEST_EMAIL="you@yourdomain.com"
HARVEST_PASSWORD="hopefully-something-secure"
```

Run the app like so:

```
mkdir -p reports && eval $(cat .env) node index.js
```
