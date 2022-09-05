# Dynaton Developer Challenge

This is a developer challenge project for a Full-Stack developer position at Dynaton Data

# Notes

1. Basic authentication was used as the user accounts could have been hardcoded

### Installation

This project uses Express for the backend and React for the front End and MySql as the database engine. Installation requires nodejs to be preset up as well as MySql

1. `git clone https://github.com/richard-muvirimi/dynatondata-developer-challenge && cd dynatondata-developer-challenge`
2. `echo "install dependencies" && npm install`
3. `echo "install server dependencies" && cd ./server && npm install && cd ..`
3. `echo "install client dependencies" && cd ./client && npm install && cd ..`
4. Rename `./server/.env.example` to `./server/.env` and edit with your environment variables
5. Edit `./client/environment.js` and set correct access url
6. Visit http://localhost:3000/install to create tables and import initial data into the database
7. Done!

### Authentication

Default user accounts are generated on install with the following credentials.

admin
username:	admin1
password:	admin1

user 1
username:	reg1
password:	reg1

user 2
username:	reg2
password:	reg2

### License 

ISC License

```
Copyright 2022 Richard Muvirimi

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```