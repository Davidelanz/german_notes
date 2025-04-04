# Just my German notes

> I like to have my notes tidy when I study. Feel free to spot any mistake if you find them useful as well!

### Build locally

To compile the website via docker locally:

```sh
docker run -it --rm -v .:/usr/src/app --user node -w /usr/src/app node:lts bash
```

then:

```sh
npm install
npm run build
npm run format
```
