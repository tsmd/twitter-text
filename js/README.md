[![Build Status](https://img.shields.io/travis/tsmd/twitter-text-tweetlength-js.svg)](https://travis-ci.org/tsmd/twitter-text-tweetlength-js) [![npm](https://img.shields.io/npm/v/twitter-text-tweetlength-js.svg)](https://www.npmjs.com/package/twitter-text-tweetlength-js) [![Bower](https://img.shields.io/bower/v/twitter-text-tweetlength-js.svg)](http://bower.io/search/?q=twitter-text-tweetlength-js)

## twitter-text-tweetlength-js

This library is a subset of official twitter-text library dedicated to counting tweet length. Autolinking, extraction and other officially-implemented features were all removed.

## NPM Users

Install it with: `npm install twitter-text-tweetlength-js`

## Usage

The `twttr.txt` namespace is exported, making it available as such:

## Tweet character count example

```js
var twitter = require('twitter-text-tweetlength-js');
twitter.getTweetLength('test.com'); // => 23
```

`getTweetLength` returns the computed length of a tweet after taking into consideration t.co URL shortening and non UTF-16 characters

## Remaining character count example

```js
var tweet = "This is a test tweet";
var remainingCharacters = 140 - twttr.txt.getTweetLength(tweet);
````
