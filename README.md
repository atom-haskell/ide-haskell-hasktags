# ide-haskell-hasktags package

Hasktags-powered replacement for symbols-view on Haskell projects

This project is in alpha.

![image](https://cloud.githubusercontent.com/assets/7275622/12073886/592fbe8e-b146-11e5-8eb7-9a5153f3fb3c.png)

## Dependencies

Atom Packages:

* [language-haskell](https://github.com/atom-haskell/language-haskell)
* [ide-haskell](https://github.com/atom-haskell/ide-haskell)

Haskell packages:

* [hasktags](https://hackage.haskell.org/package/hasktags) -- optional since v0.0.7

## Configuration

Set full path to `hasktags` executable in package settings. For example, if you installed hasktags into `$HOME/.cabal/` (default cabal location), use `/path/to/home/dir/.cabal/bin/hasktags`. Specifics *will* depend on platform.

Since 0.0.7, hasktags is bundled with the package and bundled version is used by default. It runs on top of nodejs though (via the magic of ghcjs), so a "real" binary will likely be faster.
