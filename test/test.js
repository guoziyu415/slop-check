// node test/test.js
"use strict";
var assert = require("assert");
var S = require("../slop-check.js");
var ok = 0;
function has(text, id) { var r = S.analyze(text); assert(r.byPattern.some(function (b) { return b.id === id; }), id + " not found in: " + text); ok++; }
function none(text) { var r = S.analyze(text); assert.strictEqual(r.hits.length, 0, "expected no habits in: " + text + " got " + r.byPattern.map(function (b) { return b.id; })); ok++; }

has("It's not a product launch. It's a paradigm shift.", "notx_its");
has("This isn't about speed — it's about trust.", "notx_its");
has("This isn't about speed — it's about trust.", "emdash");
has("Let's delve into the details.", "w_delve");
has("It's important to note that results vary.", "important_note");
has("Certainly! Here is the plan.", "certainly");
has("I hope this helps!", "hopehelps");
has("The result? A faster build.", "rhetq");
has("Productivity is a journey, not a destination.", "xnoty");
has("Whether you're a founder or a student, this works.", "whether");
has("See the docs:contentReference[oaicite:0]", "artifact");
none("I tried working in 25 minute blocks for a week. The first two days were rough.");
none("I'm not sure, but I think it works.");

has("もちろんです！以下にまとめました。", "ja_mochiron");
has("いかがでしたか？", "ja_ikaga");
has("これが成功の鍵となります。", "ja_kaginaru");
has("賢く働くことが鍵となります。", "ja_juuyou");
has("効率的だと言えるでしょう。", "ja_ieru");
has("お役に立てれば幸いです。", "ja_yakunitate");
none("今日は雨だった。駅まで歩いたら靴が濡れた。");

assert.strictEqual(S.detect("これは日本語の文章です。"), "ja"); ok++;
assert.strictEqual(S.detect("This is English."), "en"); ok++;

var f = S.fix("Certainly! We should leverage this — it's crucial.");
assert(f.text.indexOf("Certainly") < 0 && f.text.indexOf("leverage") < 0 && f.text.indexOf("—") < 0, f.text); ok++;
var g = S.fix("確認することができます。");
assert.strictEqual(g.text, "確認できます。"); ok++;

var short = S.analyze("One dash — here.");
assert(short.score <= 30, "short texts use a 100 word floor, got " + short.score); ok++;

console.log(ok + " checks passed");
