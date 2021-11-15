# @koaw/plugin-react

## Bundler

### Webpack 4 (default)

> Due to wrangler use webpack@4 as default, plugin provide a webpack v4 config as default.

Change wrangler.toml > `webpack_config` to,

```toml
webpack_config = "node_modules/koaw-plugin-react/webpack"
```

