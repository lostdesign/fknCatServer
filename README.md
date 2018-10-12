# fkn-cat-server
This is the server with some endpoints to receive images from anytool. It then generates a random url and returns the url to origin.
There is no registration or login required, an `api_key` is used to prevent others from uploading images onto your server or deleting them.

I also build a tray app which you can use, just set the `api_key` and manage your images from there. If you want to know more about it, check it out here (link follows)

# Installation
- clone repo
- create folder public
- create folder `i` in `public` or rename the image folder in `config.json`
- change `API_KEY` in `config.json` to something secret

# Endpoints

| METHOD | URL                 | headers   | body                                     | Description                                                                     |
|--------| ------------------- |-----------| ---------------------------------------- | ------------------------------------------------------------------------------- |
| POST   | `/api/v1/newCat`    | API_KEY   | `image` with mime type image             | Uploads new image and returns URL                                               |
| POST   | `/api/v1/killCat`   | API_KEY   | `filename` string, e.g. `ufugibukew.png` | Deletes image from folder                                                       |
| GET    | `/api/v1/listCats`  | API_KEY   | -                                        | Lists all uploaded images and returns array of filenames, e.g. `879hfiusdf.png` |
| GET    | `/api/v1/recentCat` | API_KEY   | -                                        | Lists recently uploaded image and returns the filenames, e.g. `879i545usdf.png` |
