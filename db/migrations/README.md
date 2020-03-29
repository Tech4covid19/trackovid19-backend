# Database migrations

We do not use any tool that supports running database migrations automatically.

We simple follow these rules:
* Database scripts are plain SQL scripts that should be tested against a postgres database.
* Any new script should follow the name convention in place, which is prepending a sequence number (padded with 2 zeroes at the left) to the script name.
* By doing that, most recent scripts should be listed at the bottom of the file tree
