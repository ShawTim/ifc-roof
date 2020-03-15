## ifc-roof: 香港交易廣場天台生成器

A simple static generator for a meme from HK famous drama 大時代.

See [demo](https://shawtim.github.io/ifc-roof/) on Github page.

![Introduction](https://shawtim.github.io/ifc-roof/intro.png)

### Installation

```bash
npm i
npm run build
```

All built files will then delivered to `/docs` folder. (the default Github page folder)

### Test

Open `/docs/index.html` in browser to preview, or:

```bash
npx http-server docs
```

Please make sure the text of location is readable, while spacing and size get close to original image:

1. Mix of Chinese and English characters, e.g. "香港某 Hotel 騎樓"
1. Reasonably long English name
1. Some common punctuations, e.g. A.P.M.
