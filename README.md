# notepane

A note taking app that allows you to easily take notes and share them to the public.

# importing and exporting

You can import files from **Google Keeps** with the [takeout service.](https://takeout.google.com/) A directory of .json and .html files will be exported from Googke Keeps which can be opened by Notepane. Notepane exports can also be imported.

Exports from Notepane will be formatted in .json files.

# endpoints

All endpoints have a default ratelimit of 10 requests every 20 seconds and gets reset if sucessfully authenticated.

### endpoint authentication

To authenticate with an endpoint, use your `PASSWORD` enviornment variable as the key. This should be in the **Authorization Header** of the API request.

```js
fetch("https://notepane-self-host-url.com/api/auth", {
    headers: {
      "Authorization": "Bearer PASSWORD.ENV.HERE"
    }
})
```

|type  |endpoint           |authentication|markdown|public_url|public_pane|id |pinned|created_at|modified_at|
|------|-------------------|--------------|--------|----------|-----------|---|------|----------|-----------|
|GET   |`/auth`            |TRUE          |        |          |           |   |      |          |           |
|GET   |`/notes/get`       |TRUE          |        |          |           |   |      |          |           |
|GET   |`/notes/get/[uuid]`|DEPENDS       |        |          |           |   |      |          |           |
|GET   |`/notes/get/public`|FALSE         |        |          |           |   |      |          |           |
|POST  |`/notes/create`    |TRUE          |STRING  |BOOL      |BOOL       |   |      |ISOSTRING |ISOSTRING  |
|POST  |`/notes/modify`    |TRUE          |STRING  |BOOL      |BOOL       |INT|BOOL  |          |           |
|DELETE|`/notes/remove`    |TRUE          |        |          |           |INT|      |          |           |


## dev enviornment setup

```sh
docker compose up db

npm run dev
```

## enviornment variables

```env

PASSWORD=1234 # this is the password to notepane

POSTGRES_USER=user
POSTGRES_PASSWORD=pass # have a secure password!
POSTGRES_HOSTNAME=db # default to either process.env.DOCKER_ENV ? 'db' : 'localhost'
POSTGRES_DB=mydb

BACKUP_INTERVAL=86400

ORIGIN=http://localhost:3000
```

## production

```sh
docker compose up
```