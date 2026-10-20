#!/usr/bin/env node
/* slop-check CLI. Finds common AI writing habits in text files.
   Usage:
     slop-check README.md post.txt        print habits per file
     cat draft.txt | slop-check           read from stdin
     slop-check --max 40 docs/*.md        exit 1 if any file scores above 40
     slop-check --fix draft.txt           print the text with the easy swaps applied
     slop-check --json draft.txt          machine readable output
     slop-check --lang ja note.txt        force a language, default auto
   MIT License. https://github.com/guoziyu415/slop-check */
"use strict";
var fs = require("fs");
var path = require("path");
var S = require(path.join(__dirname, "slop-check.js"));

var args = process.argv.slice(2), files = [], opt = { max: null, fix: false, json: false, lang: "auto", quiet: false };
for (var i = 0; i < args.length; i++) {
  var a = args[i];
  if (a === "--max") opt.max = parseFloat(args[++i]);
  else if (a === "--fix") opt.fix = true;
  else if (a === "--json") opt.json = true;
  else if (a === "--quiet" || a === "-q") opt.quiet = true;
  else if (a === "--lang") opt.lang = args[++i];
  else if (a === "-h" || a === "--help") { console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace(/^[\s\S]*?Usage:\n/, "Usage:\n").replace(/^ {3}/gm, "")); process.exit(0); }
  else if (a === "-v" || a === "--version") { console.log(S.version); process.exit(0); }
  else files.push(a);
}

var tty = process.stdout.isTTY && !process.env.NO_COLOR;
var C = { punct: 205, struct: 214, phrase: 51, word: 141, bot: 203, fmt: 84 };
function color(code, s) { return tty ? "\x1b[38;5;" + code + "m" + s + "\x1b[0m" : s; }
function bold(s) { return tty ? "\x1b[1m" + s + "\x1b[0m" : s; }

function lineCol(text, idx) {
  var before = text.slice(0, idx), line = before.split("\n").length;
  return line + ":" + (idx - before.lastIndexOf("\n"));
}

function report(name, text) {
  if (opt.fix) { process.stdout.write(S.fix(text, { lang: opt.lang }).text); return 0; }
  var r = S.analyze(text, { lang: opt.lang });
  var over = opt.max !== null && r.score > opt.max;
  if (opt.json) {
    console.log(JSON.stringify({ file: name, lang: r.lang, units: r.units, score: r.score, band: r.band.key, over: over,
      habits: r.hits.map(function (h) { return { at: lineCol(text, h.s), id: h.id, cat: h.cat, weight: h.w, text: text.slice(h.s, h.e) }; }) }));
    return over ? 1 : 0;
  }
  var unit = r.lang === "ja" ? "per 2,000 chars" : "per 1,000 words";
  console.log(bold(name) + "  score " + bold(String(r.score)) + " " + unit + "  " + r.band.en + "  (" + r.hits.length + " habits, " + r.units + (r.lang === "ja" ? " chars" : " words") + ")" + (over ? color(203, "  over " + opt.max) : ""));
  if (!opt.quiet) r.hits.forEach(function (h) {
    var p = S.PATTERNS.filter(function (x) { return x.id === h.id && x.lang === r.lang; })[0];
    var snip = text.slice(h.s, h.e).replace(/\s+/g, " ");
    if (snip.length > 70) snip = snip.slice(0, 67) + "...";
    console.log("  " + lineCol(text, h.s).padEnd(8) + color(C[h.cat] || 250, (p ? p.label : h.id).padEnd(28)) + " " + snip);
  });
  return over ? 1 : 0;
}

var code = 0;
if (!files.length) {
  if (process.stdin.isTTY) { console.error("Give a file, or pipe text in. slop-check --help for options."); process.exit(2); }
  var buf = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", function (d) { buf += d; });
  process.stdin.on("end", function () { process.exit(report("stdin", buf)); });
} else {
  files.forEach(function (f) {
    try { code = Math.max(code, report(f, fs.readFileSync(f, "utf8"))); }
    catch (e) { console.error(f + ": " + e.message); code = 2; }
  });
  process.exit(code);
}
