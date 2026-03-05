# notepane

A note taking app that allows you to easily take notes and share them to the public.

# endpoints

All endpoints have a default ratelimit of 10 requests every 20 seconds and gets reset if sucessfully authenticated.

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


## production

```sh
docker compose up
```