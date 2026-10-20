/* Slop Check core. Finds common AI writing habits in English and Japanese text.
   MIT License. https://github.com/guoziyu415/slop-check
   A habit is not proof. People write like this too. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SlopCheck = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var CATS = {
    punct: { en: "Dashes", ja: "記号の癖", color: "#ff4fa3" },
    struct: { en: "Sentence tricks", ja: "構文の癖", color: "#ffb02e" },
    phrase: { en: "Stock phrases", ja: "定型句", color: "#3ee6ff" },
    word: { en: "Pet words", ja: "AIがよく使う語", color: "#8b7bff" },
    bot: { en: "Chatbot leftovers", ja: "チャットボットの名残", color: "#ff5f5f" },
    fmt: { en: "Formatting", ja: "書式", color: "#4dffa6" }
  };

  // Each pattern: id, lang, cat, re (source), f (flags), w (weight), label, why, fix
  var P = [];
  function add(lang, cat, id, re, w, label, why, fix, flags) {
    if (re instanceof RegExp) { flags = re.flags; re = re.source; }
    P.push({ id: id, lang: lang, cat: cat, re: re, f: flags || "gi", w: w, label: label, why: why, fix: fix || "" });
  }

  /* ---------------- English ---------------- */
  add("en", "punct", "emdash", "\\s?[\u2014]\\s?|\\s\u2013\\s|\\s--\\s", 3, "Em dash",
    "Chatbots put an em dash where a comma or a period would do. One is fine. One every other sentence is a tell.",
    "Use a comma or a period, or split the sentence.");

  add("en", "struct", "notx_its", "\\b(?:(?:it|that|this|he|she|they|you|we)'?s\\s+not|(?:is|are|was|were)\\s+not|isn'?t|aren'?t|wasn'?t|weren'?t)\\s+(?:just\\s+|only\\s+|merely\\s+|simply\\s+|about\\s+)?[^.!?\\n]{1,60}?[,;.\u2014\u2013]\\s*(?:it'?s|it is|it was|they'?re|they are|this is|that'?s|but)\\b", 3, "It's not X, it's Y",
    "The negative parallelism. It sets up a straw man just to knock it down, and models use it constantly.",
    "Say the Y part directly.");
  add("en", "struct", "notonly", "\\bnot (?:just|only|merely|simply) [^.!?\\n]{1,60}?,? but (?:also )?", 3, "Not only X but Y",
    "Same trick in a longer form. It makes a plain point sound like a reveal.",
    "Keep the stronger half.");
  add("en", "struct", "nonojust", "\\bNo [^.!?\\n]{1,40}[.!]\\s+No [^.!?\\n]{1,40}[.!](?:\\s+(?:Just|Only) [^.!?\\n]{1,40}[.!])?", 3, "No X. No Y. Just Z.",
    "Staccato ad copy. Very common in model written posts.",
    "Write one normal sentence.", "g");
  add("en", "struct", "rhetq", "\\b(?:The (?:result|answer|catch|kicker|best part|truth|secret|twist|problem|goal|difference|reason|takeaway|verdict|outcome)|What happened next|Why does (?:this|it|that) matter|Sound familiar|The good news|The bad news)\\?", 2, "Question, then the answer",
    "A short question that the next sentence answers. It fakes suspense.",
    "Just state the answer.", "g");
  add("en", "struct", "whether", "\\bwhether you(?:'re| are) (?:a |an )?[^,.!?\\n]{1,40} or (?:a |an |just )?[^,.!?\\n]{1,40}", 2, "Whether you're X or Y",
    "Tries to address every reader at once. Nobody talks like this.",
    "Pick the reader you actually mean.");
  add("en", "struct", "fromto", "(?:^|(?<=[.!?]\\s))From [^,.!?\\n]{2,40} to [^,.!?\\n]{2,40},", 2, "From X to Y",
    "A false range between two loosely related things, used to sound sweeping.",
    "Name the one thing you mean.", "g");
  add("en", "struct", "xnoty", "\\b(?:is|are|was|feels?|becomes?) (?:a |an |the )?[A-Za-z][^,.!?\\n]{1,30}, not (?:a |an |the )?[^,.!?\\n]{2,30}[.!]", 2, "X, not Y",
    "A slogan shaped sentence like a journey, not a destination.",
    "Say the one thing you mean.");
  add("en", "struct", "three", "\\b[A-Za-z]{3,}, [A-Za-z]{3,},? and [A-Za-z]{3,}\\b", 0.5, "List of three",
    "Models love groups of three. One list means nothing. Every list being three is the tell.",
    "Use two, or four, or the one that matters.");

  var enPhrases = [
    ["important_note", "it(?:'s| is) (?:important|crucial|essential|worth) (?:to )?(?:note|noting|remember|mention|mentioning|keep in mind)(?: that)?", 2, "It's worth noting", "Filler that announces a point instead of making it.", "Delete it and keep the point."],
    ["todays_world", "in today'?s (?:fast[- ]paced|digital|modern|ever[- ]changing|rapidly evolving|interconnected) (?:world|age|landscape|era)", 2, "In today's fast paced world", "A stock opener that says nothing.", "Start with the actual point."],
    ["ever_evolving", "ever[- ](?:evolving|changing|growing)", 2, "Ever evolving", "Vague motion words that make anything sound important.", "Say what changed."],
    ["plays_role", "plays? an? (?:crucial|vital|pivotal|key|important|significant|central) role", 2, "Plays a crucial role", "Inflated way to say something matters.", "Say how it matters."],
    ["testament", "(?:is|stands as|serves as) a (?:true |powerful )?testament to", 2, "A testament to", "Grand phrase models reach for.", "Say it shows."],
    ["tapestry", "(?:rich|vibrant|intricate|complex) tapestry", 2, "Rich tapestry", "Classic model flourish.", "Say mix or range, or cut it."],
    ["navigate", "navigat(?:e|ing) the (?:complexities|challenges|intricacies|landscape|world)", 2, "Navigate the complexities", "Abstract travel metaphor.", "Say handle or deal with."],
    ["realm", "in the (?:realm|world|landscape) of", 2, "In the realm of", "Padding before the noun.", "Just say in."],
    ["unlock", "unlock(?:ing)? (?:the|its|your) (?:full |true )?potential", 2, "Unlock the potential", "Ad copy.", "Say what it lets you do."],
    ["nextlevel", "take (?:it|this|things|your [a-z]+) to the next level", 2, "Take it to the next level", "Ad copy.", "Say what gets better."],
    ["endofday", "at the end of the day", 1, "At the end of the day", "Filler.", "Cut it."],
    ["whenitcomes", "when it comes to", 1, "When it comes to", "Filler before the topic.", "Name the topic directly."],
    ["diveinto", "(?:let'?s |we'?ll )?(?:take a )?(?:deep )?dive (?:deep )?into|deep dive", 2, "Dive into", "Chatbot favourite for starting anything.", "Say look at."],
    ["gamechanger", "game[- ]chang(?:er|ing)", 2, "Game changer", "Hype word.", "Say what changes."],
    ["herethething", "here'?s (?:the thing|the kicker|the catch|the deal|why|what (?:happened|you need to know))", 2, "Here's the thing", "Signpost that delays the point.", "Make the point."],
    ["letsinkin", "let that sink in|buckle up|make no mistake|spoiler alert|the bottom line(?: is)?|in a world where", 2, "Let that sink in", "Thread bait signposts.", "Cut it."],
    ["conclusion", "(?:in conclusion|in summary|to sum up|to summari[sz]e|all in all|in essence)", 2, "In conclusion", "Compulsive summary. Short texts don't need one.", "End on the last real point."],
    ["transitions", "(?:moreover|furthermore|additionally|consequently|notably|ultimately|overall),", 1, "Moreover, furthermore", "Essay connectors that pile up in model text.", "Use and, also, or nothing."],
    ["thatbeing", "that being said|with that in mind|it goes without saying|needless to say", 1, "That being said", "Filler transition.", "Cut it."],
    ["myriad", "a (?:myriad|plethora|wide (?:range|array|variety)|diverse range) of", 1, "A myriad of", "Padding for many.", "Say many, or the number."],
    ["journey", "embark(?:ing)? on (?:a|an|this|your) (?:\\w+ )?journey|on (?:this|your|our) journey", 2, "Embark on a journey", "Everything is a journey to a model.", "Say start."],
    ["harness", "harness(?:ing)? the power of|the power of", 1, "Harness the power of", "Hype padding.", "Say use."],
    ["reminder", "(?:serves as|is) a (?:powerful|stark|vivid|poignant|gentle) reminder", 2, "A powerful reminder", "Grand phrase.", "Say it shows."],
    ["paveway", "pav(?:e|es|ing) the way|shed(?:s|ding)? light on|sense of community|foster(?:s|ing)? a sense of", 1, "Pave the way", "Stock phrase.", "Say it plainly."],
    ["lookfurther", "look no further|elevate your|seamless(?:ly)? integrat\\w*", 2, "Look no further", "Marketing voice.", "Say what it does."]
  ];
  enPhrases.forEach(function (x) { add("en", "phrase", x[0], "\\b(?:" + x[1] + ")\\b", x[2], x[3], x[4], x[5]); });

  var enWords = {
    delve: ["delv(?:e|es|ed|ing)", 2, "Delves up 28 times in 2024 papers in one study. The best known model word.", "look at, dig into"],
    tapestry: ["tapestr(?:y|ies)", 1.5, "Flowery word models overuse.", "mix"],
    testament: ["testament", 1, "Overused for shows.", "sign"],
    underscore: ["underscor(?:e|es|ed|ing)", 1, "Up about 11 times in 2024 papers in one study.", "shows"],
    showcase: ["showcas(?:e|es|ed|ing)", 1, "Up about 10 times in 2024 papers in one study.", "show"],
    pivotal: ["pivotal", 1, "Inflated importance.", "key"],
    crucial: ["crucial(?:ly)?", 1, "Inflated importance.", "key, needed"],
    intricate: ["intricate(?:ly)?|intricacies", 1, "Model favourite.", "detailed"],
    multifaceted: ["multifaceted|nuanced", 1, "Says complex without saying how.", "say how"],
    foster: ["foster(?:s|ed|ing)?", 1, "Model favourite.", "build, grow"],
    enhance: ["enhanc(?:e|es|ed|ing|ement)", 0.5, "Common in model text.", "improve"],
    seamless: ["seamless(?:ly)?", 1, "Marketing word.", "smooth"],
    robust: ["robust", 0.5, "Model favourite.", "solid"],
    leverage: ["leverag(?:e|es|ed|ing)", 1, "Business padding.", "use"],
    utilize: ["utili[sz](?:e|es|ed|ing|ation)", 1, "Long word for use.", "use"],
    realm: ["realms?", 1, "Fantasy word in plain writing.", "area"],
    vibrant: ["vibrant", 1, "Model favourite.", "lively"],
    nestled: ["nestled", 1, "Travel copy cliche.", "set"],
    boasts: ["boasts?", 1, "Brochure verb.", "has"],
    unwavering: ["unwavering", 1, "Model favourite.", "steady"],
    holistic: ["holistic(?:ally)?", 1, "Vague.", "whole"],
    transformative: ["transformative|groundbreaking|revolutionary|revolutioni[sz]e", 1, "Hype word.", "say what changes"],
    empower: ["empower(?:s|ed|ing|ment)?", 1, "Hype word.", "help, let"],
    elevate: ["elevat(?:e|es|ed|ing)", 1, "Marketing verb.", "improve"],
    meticulous: ["meticulous(?:ly)?", 1, "Model favourite.", "careful"],
    commendable: ["commendable|noteworthy|invaluable|unparalleled", 1, "Inflated praise.", "good, useful"],
    paramount: ["paramount", 1, "Inflated importance.", "most important"],
    bustling: ["bustling", 1, "Travel copy cliche.", "busy"],
    beacon: ["beacons?", 1, "Flowery.", "example"],
    symphony: ["symphony of", 1, "Flowery.", "mix"],
    resonate: ["resonat(?:e|es|ed|ing)", 1, "Model favourite.", "connect, land"],
    harness: ["harness(?:es|ed|ing)?", 0.5, "Model favourite.", "use"],
    streamline: ["streamlin(?:e|es|ed|ing)", 0.5, "Business padding.", "simplify"],
    landscape: ["landscape", 0.5, "Used for any field or market.", "field, market"],
    navigate: ["navigat(?:e|es|ed|ing)", 0.5, "Used for any difficulty.", "handle"],
    embark: ["embark(?:s|ed|ing)?", 1, "Used for any start.", "start"],
    cornerstone: ["cornerstone|linchpin", 1, "Flowery.", "base"],
    interplay: ["interplay", 1, "Model favourite.", "mix"],
    captivating: ["captivating|enchanting|breathtaking|awe[- ]inspiring", 1, "Model favourite.", "say what you saw"],
    profound: ["profound(?:ly)?", 0.5, "Inflated.", "deep, big"],
    bolster: ["bolster(?:s|ed|ing)?|spearhead(?:s|ed|ing)?|garner(?:s|ed|ing)?", 1, "News speak models copy.", "boost, lead, get"],
    unleash: ["unleash(?:es|ed|ing)?", 1, "Hype word.", "release"],
    tailored: ["tailored", 0.5, "Marketing word.", "made for"],
    comprehensive: ["comprehensive", 0.5, "Model favourite.", "full"],
    insightful: ["insightful|thought[- ]provoking", 1, "Inflated praise.", "useful"],
    dynamic: ["dynamic", 0.5, "Vague.", "say how"],
    journey: ["journey", 0.5, "Everything is a journey to a model.", "say what it is"]
  };
  Object.keys(enWords).forEach(function (k) {
    var x = enWords[k];
    add("en", "word", "w_" + k, "\\b(?:" + x[0] + ")\\b", x[1], k, x[2], "Try: " + x[3]);
  });

  add("en", "bot", "certainly", "(?:^|(?<=[\\n.!?]\\s?))\\s*(?:Certainly|Absolutely|Of course|Sure|Great question|Great idea|Excellent question)[!,.]", 3, "Certainly!",
    "Chatbot greeting pasted straight into the text.", "Delete it.", "gim");
  add("en", "bot", "hopehelps", "\\bI hope (?:this|that) (?:helps|clarifies|was helpful)\\b|\\bhope this helps\\b", 3, "I hope this helps",
    "Chatbot sign off.", "Delete it.");
  add("en", "bot", "feelfree", "\\bfeel free to\\b|\\blet me know if you(?:'d| would)? (?:have|need|want|like)\\b|\\bhappy to help\\b|\\bI'?d be (?:happy|glad) to\\b", 2, "Feel free to",
    "Assistant voice. Fine in support email, odd in a post.", "Cut it or say it your way.");
  add("en", "bot", "asanai", "\\bas an AI(?: language model)?\\b|\\bas of my (?:last )?(?:knowledge|training) (?:cutoff|update)\\b|\\bI (?:don'?t|do not) have (?:personal|real[- ]time)\\b", 5, "As an AI",
    "Model disclaimer left in the text.", "Delete it.");
  add("en", "bot", "heresa", "\\bhere(?:'s| is) (?:a|an|the|your) (?:breakdown|summary|quick (?:summary|overview|breakdown)|revised|rewritten|polished|improved|refined|overview)\\b", 2, "Here's a breakdown",
    "Assistant handing over a draft.", "Start with the content.");
  add("en", "bot", "artifact", "contentReference|oaicite|oai_citation|utm_source=chatgpt\\.com", 5, "Copy and paste residue",
    "Citation markers from the ChatGPT window. About as sure a sign as it gets.", "Delete them.", "g");
  add("en", "bot", "findswell", "\\bI hope (?:this|my) (?:email|message|note) finds you well\\b", 2, "Hope this email finds you well",
    "Template opener. Humans use it too, models use it always.", "Start with why you are writing.");

  add("en", "fmt", "bold", "\\*\\*[^*\\n]{1,60}\\*\\*", 1, "Bold everywhere",
    "Bolded key terms in every line, pasted from a chat window.", "Remove the stars.", "g");
  add("en", "fmt", "emojihead", "^[ \\t]*(?:\\p{Extended_Pictographic})\\uFE0F?[ \\t]*(?=\\S)", 1, "Emoji bullets",
    "Rocket and sparkle emoji at the start of lines, the thread template look.", "Use plain lines.", "gmu");
  add("en", "fmt", "arrow", "\u2192|\u27a1\ufe0f?", 0.5, "Arrows",
    "Arrows used as bullets or as therefore.", "Use words.", "g");

  /* ---------------- Japanese ----------------
     Collected from Japanese write ups on AI flavoured writing, see PATTERNS.md for the sources.
     Most of these are fine once. They read as AI when they pile up. */
  function ja(cat, id, re, w, label, why, fix) { add("ja", cat, id, re, w, label, why, fix); }

  // Chatbot leftovers
  ja("bot", "ja_mochiron", /^[ \t　]*(?:もちろんです|承知しました|かしこまりました|はい、承知しました)[！!。、]/gm, 3, "もちろんです！", "AIへの指示に答えた返事が、そのまま残っています。", "削除して中身から書く");
  ja("bot", "ja_ikani", /以下(?:に|のとおり|の通り|では)[^。\n]{0,30}(?:まとめ|整理|紹介|挙げ|解説)/g, 2, "以下にまとめました", "チャットの返答の決まり文句です。", "削除して本題から書く");
  ja("bot", "ja_question", /(?:素晴らしい|鋭い|良い|いい)(?:ご?質問|視点|ご指摘)です(?:ね)?|ご質問ありがとうございます/g, 3, "素晴らしい質問ですね", "お世辞から入るAIの返答です。", "削除して答えから書く");
  ja("bot", "ja_yakunitate", /(?:お役に立て|参考にな)(?:れば|たら)(?:幸いです|嬉しいです)|一助となれば幸い/g, 3, "お役に立てれば幸いです", "チャットボットとブログの締めの定型句です。", "削除する");
  ja("bot", "ja_kigaru", /(?:ご不明な点|ご質問|お困りのこと)[^。\n]{0,12}(?:あれば|ありましたら)[^。\n]{0,6}(?:お気軽に|いつでも)/g, 3, "お気軽にお尋ねください", "チャットの締めの申し出です。", "削除する");
  ja("bot", "ja_cutoff", /知識のカットオフ|リアルタイムの情報にアクセスでき|最新の情報と異なる場合があります/g, 4, "知識のカットオフ", "モデルの断り書きが残っています。", "削除し、必要なら確認した日付を書く");
  ja("bot", "ja_artifact", /contentReference|oaicite|oai_citation|utm_source=chatgpt\.com/g, 5, "コピペの痕跡", "ChatGPTの引用表示の残骸です。ほぼ確実な痕跡です。", "削除する");

  // Stock phrases
  ja("phrase", "ja_ikaga", /いかがでした(?:でしょう)?か/g, 3, "いかがでしたか", "情報のない締めの一文です。AI以前のまとめブログ時代からある定型です。", "削除し、具体的な一文で終える");
  ja("phrase", "ja_honkiji", /(?:本|この)記事では[^。\n]{0,40}(?:解説|紹介|まとめ|説明)/g, 2, "本記事では〜を解説します", "中身の前に構成を予告する書き出しです。", "いきなり本題から書く");
  ja("phrase", "ja_kaisetsu", /(?:について|を)(?:詳しく)?(?:解説|ご?紹介|ご?説明)(?:します|していきます|いたします)|(?:見て|掘り下げて|整理して)いきましょう/g, 2, "〜を解説していきます", "見出しを読めば分かることを繰り返す前置きです。", "削除して一つ目の内容を書く");
  ja("phrase", "ja_kinen", /近年、[^。\n]{0,30}(?:急速に|ますます)|注目を集めて(?:い|お)|現代社会において|デジタル時代において|今日の(?:社会|世界)において|ますます重要に/g, 2, "現代社会において", "どんな話題にも使える、時代から入る書き出しです。", "具体的な数字や自分の体験から書く");
  ja("phrase", "ja_nayami", /で悩んでいませんか|そんなあなた(?:へ|に)/g, 2, "〜で悩んでいませんか", "広告の呼び込みの型です。", "事実か意見から書き出す");
  ja("phrase", "ja_ketsuron", /結論から(?:言うと|申し上げますと)|正直に言うと|率直に言うと/g, 1, "結論から言うと", "前置きの決まり文句です。", "そのまま結論を書く");
  ja("phrase", "ja_matome", /(?:まとめると|総じて|要するに|結論として|以上のように|総合的に見ると)、/g, 2, "まとめると、", "型どおりのまとめです。", "「つまり」にするか削除する");
  ja("phrase", "ja_zehi", /ぜひ[^。\n]{0,14}(?:参考|試し|活用|取り入れ|チェック)/g, 1.5, "ぜひ試してみてください", "儀式のような呼びかけです。", "1記事に1回まで");
  ja("phrase", "ja_kanosei", /大きな可能性を秘め|無限の可能性|新たな章の幕開け|今後の展開に注目/g, 2, "大きな可能性を秘めています", "中身のない、未来に向けた締めです。", "次の具体的な予定や数字を書く");
  ja("phrase", "ja_yakuwari", /(?:重要な|大きな|不可欠な|中心的な)役割を(?:果たし|担)|欠かせない存在|必要不可欠/g, 2, "重要な役割を果たす", "役割を大げさに言う定型です。", "何をするのかを書く");
  ja("phrase", "ja_kachi", /新たな価値|価値を(?:創出|提供)|未来を切り[拓開]/g, 1.5, "新たな価値を創出", "PR文の決まり文句です。", "誰に何の得があるかを書く");

  // Sentence habits
  ja("struct", "ja_ieru", /と(?:言|い)える(?:でしょう|だろう)|と言えます/g, 2.5, "〜と言えるでしょう", "根拠のない、ぼかした結論です。", "「〜です」か「〜だと思う」");
  ja("struct", "ja_nodehanai", /のではないでしょうか[。？?]|に他な(?:らない|りません)|と言っても過言では(?:ない|ありません)|であることは間違いな/g, 2, "〜のではないでしょうか", "やわらかい断定、または硬すぎる強調です。", "言い切るか「〜だと思う」");
  ja("struct", "ja_juuyou", /ことが(?:非常に|とても)?(?:重要|大切|不可欠|鍵)(?:です|となります|になります)|が求められます/g, 2, "〜することが大切です", "教科書のようなお説教です。", "理由を書くか、文ごと削除する");
  ja("struct", "ja_juuyounoha", /(?:最も|特に)?(?:重要|大切|大事)なのは|注目すべきは/g, 1.5, "重要なのは〜", "要点を言う前に予告しています。", "要点を直接書く");
  ja("struct", "ja_dakedenaku", /単に[^。\n]{1,20}だけでなく|だけでなく[^。\n]{1,25}も|単なる[^。\n]{1,15}ではなく/g, 2.5, "〜だけでなく〜も", "「XではなくY」型の対比で盛り上げる癖です。", "言いたい方だけ直接書く");
  ja("struct", "ja_dehanaku", /ではなく、/g, 1, "〜ではなく、〜", "英語の not X but Y を直訳したような対比です。", "言いたい方だけ書く");
  ja("struct", "ja_kaginaru", /(?:鍵|カギ)(?:と|に)な(?:る|ります)/g, 2, "〜が鍵となります", "決まり文句の比喩です。", "何が必要かを書く");
  ja("struct", "ja_npoint", /[2-7２-７二三四五六七]つの(?:ポイント|理由|ステップ|コツ|観点|原則|メリット|方法)/g, 1.5, "3つのポイント", "なんでも数をそろえてまとめる癖です。", "数を決めずに書く");
  ja("struct", "ja_rhetq", /(?:なぜ|どうして)(?:なの)?でしょうか[？?]\s*(?:それは|答えは)|その(?:答え|理由)は[？?]/g, 2, "なぜでしょうか？それは", "自分で問いを立てて自分で答える型です。", "直接述べる");
  ja("struct", "ja_korenoyori", /これにより/g, 1, "これにより", "人はあまり使わない、硬いつなぎの言葉です。", "「そのため」か、文をつなぐ");
  ja("struct", "ja_shimesu", /(?:ことを|傾向を)示している|可能性を示唆している|点に留意が必要/g, 1.5, "〜ことを示している", "論文を直訳したような言い回しです。", "「〜だろう」と書き、出典を添える");
  ja("struct", "ja_dekiru", /することが(?:でき|可能)/g, 1, "〜することができます", "英語の直訳調の回りくどさです。", "「〜できます」");
  ja("struct", "ja_kanten", /という(?:観点|視点)(?:から|で)|という点(?:で|において)/g, 1, "〜という観点から", "水増しの言い回しです。", "削除するか「〜で見ると」");
  ja("struct", "ja_ikkai", /一概には言え|ケースバイケース|場合によります|一長一短|目的に応じて[^。\n]{0,15}使い分けることが(?:重要|大切)/g, 2, "一概には言えません", "立場を決めずに逃げる型です。", "立場を一つ決めて根拠を添える");
  ja("struct", "ja_kangaerareru", /と考えられ(?:ます|るでしょう)/g, 1, "〜と考えられます", "主語のない、ぼかした言い方です。", "「私は〜と思う。理由は〜」");
  ja("struct", "ja_mazusaisho", /まず最初に|第一に/g, 1, "まず最初に", "手順書のような並べ方です。", "「まず」か、自然な流れで書く");

  // Pet words
  ja("word", "ja_seamless", /シームレス/g, 1.5, "シームレス", "カタカナの流行語です。", "途切れずに、スムーズに");
  ja("word", "ja_hype", /革命的|ゲームチェンジャー|パラダイムシフト|可能性を解き放|民主化する|スーパーチャージ|未来を変える|究極の|次世代の/g, 1.5, "革命的", "誇大な言葉です。", "何がどう変わったかを書く");
  ja("word", "ja_abstract", /包括的|網羅的|多角的|革新的|画期的|飛躍的|圧倒的/g, 1, "画期的", "中身のない評価語です。", "何がどう変わったかを書く");
  ja("word", "ja_kaizoudo", /解像度(?:が|を)(?:上が|上げ|高)|腹落ち|メンタルモデル|手触り感|温度感|肌感/g, 1.5, "解像度が上がる", "理解や手触りを装う言葉です。最近のAIの文章によく出ます。", "どこが分かったのかを具体的に書く");
  ja("word", "ja_metaphor", /羅針盤|車の両輪|架け橋|起爆剤|潤滑油/g, 1.5, "羅針盤", "型どおりの比喩です。", "具体的に書く");
  ja("word", "ja_samazama", /(?:様々|さまざま|多様|幅広い)な/g, 0.5, "さまざまな", "あいまいな量の言い方です。人もよく使うので軽く数えます。", "具体例を2つ挙げる");
  ja("word", "ja_tekisetsu", /適切な|効率的な|必要に応じて/g, 0.5, "適切な", "何が適切かを書いていない言葉です。", "基準や数字を書く");
  ja("word", "ja_hijouni", /(?:非常に|極めて)(?:重要|有効|効果的|魅力的|便利|強力)/g, 1, "非常に重要", "根拠のない強調です。", "根拠を一つ添える");
  ja("word", "ja_newgen", /静かに壊れ|黙って(?:スキップ|無視)|地味に効|時間を溶か|落とし穴|伴走|橋渡し/g, 1, "静かに壊れる", "2025年以降のモデルの文章に増えた言い回しです。", "何が起きるかをそのまま書く");
  ja("word", "ja_katakana", /コンテキスト|アライメント|ナレッジ|プライオリティ|レバレッジ|ディープダイブ|アラインする|シナジー/g, 1, "ナレッジ", "日本語で言えるのにカタカナ語を使っています。", "知識、文脈、優先度など");
  ja("word", "ja_dodai", /土台/g, 0.5, "土台", "AI以後に急に増えた語のひとつです。", "基本、基礎");

  // Symbols and formatting
  ja("punct", "ja_dash", /——|──|―{2}|—/g, 2, "ダッシュ「—」", "英語から持ち込まれたダッシュです。小説の「――」は普通の用法です。", "読点、句点、改行にする");
  ja("fmt", "ja_labelcolon", /\*\*[^*\n]{1,30}\*\*[：:]/g, 2, "**見出し**：説明", "太字のラベルとコロンで並べる、AIの典型的な書式です。", "文章に溶かす");
  ja("fmt", "ja_colonend", /(?:します|ます|です|例えば|以下)[：:][ \t]*$/gm, 1.5, "〜は次のとおりです：", "英語の as follows: をそのまま持ち込んだ癖です。", "「次のとおりです。」");
  ja("fmt", "ja_bold", /\*\*[^*\n]{1,60}\*\*/g, 1, "太字だらけ", "チャット画面の太字記号がそのまま残っています。", "記号を外す");
  ja("fmt", "ja_emojihead", /^[ \t　]*\p{Extended_Pictographic}️?[ \t　]*(?=\S)/gmu, 1, "絵文字の箇条書き", "✅や🚀で始まる行。AIの投稿テンプレートの見た目です。", "普通の行にする");
  ja("fmt", "ja_mdhead", /^#{1,4}[ \t]/gm, 1, "Markdownの見出し記号", "見出し記号がそのまま残っています。", "記号を外す");

  /* ---------------- engine ---------------- */
  var compiled = null;
  function compile() {
    if (compiled) return compiled;
    compiled = P.map(function (p) {
      var re;
      try { re = new RegExp(p.re, p.f.indexOf("g") < 0 ? p.f + "g" : p.f); } catch (e) { re = null; }
      return { p: p, re: re };
    }).filter(function (x) { return x.re; });
    return compiled;
  }

  var JA_CHAR = /[\u3040-\u30ff\u3400-\u9fff\uff66-\uff9f]/g;
  function detect(text) {
    var ja = (text.match(JA_CHAR) || []).length;
    var latin = (text.match(/[A-Za-z]/g) || []).length;
    return ja > latin * 0.25 ? "ja" : "en";
  }
  function countUnits(text, lang) {
    if (lang === "ja") return text.replace(/\s/g, "").length;
    return (text.match(/[A-Za-z0-9\u00C0-\u024F]+(?:['\u2019][A-Za-z]+)*/g) || []).length;
  }

  // Score: weighted habits per 1,000 English words, or per 2,000 Japanese characters.
  // Short texts are scored as if they had at least 100 words or 200 characters, so one dash in a tweet does not read as 150.
  var BANDS = [
    { max: 15, key: "plain", en: "Reads human", ja: "人間らしい" },
    { max: 40, key: "some", en: "A few tells", ja: "少しAIっぽい" },
    { max: 80, key: "many", en: "Lots of tells", ja: "かなりAIっぽい" },
    { max: 1e9, key: "bot", en: "Chatbot voice", ja: "チャットボットの文章" }
  ];

  function analyze(text, opts) {
    opts = opts || {};
    text = String(text || "");
    var lang = opts.lang && opts.lang !== "auto" ? opts.lang : detect(text);
    var raw = [];
    compile().forEach(function (c) {
      if (c.p.lang !== lang) return;
      c.re.lastIndex = 0;
      var m, guard = 0;
      while ((m = c.re.exec(text)) && guard++ < 5000) {
        var s = m.index, e = s + m[0].length;
        if (e === s) { c.re.lastIndex++; continue; }
        // trim leading and trailing spaces from the highlighted span
        while (s < e && /\s/.test(text[s])) s++;
        while (e > s && /\s/.test(text[e - 1])) e--;
        if (e > s) raw.push({ s: s, e: e, p: c.p });
      }
    });
    function resolve(list) {
      list.sort(function (a, b) { return a.s - b.s || b.p.w - a.p.w || (b.e - b.s) - (a.e - a.s); });
      var out = [], lastEnd = -1;
      list.forEach(function (h) {
        if (h.s >= lastEnd) { out.push(h); lastEnd = h.e; }
        else {
          var prev = out[out.length - 1];
          // a heavier pattern that overlaps replaces a lighter one
          if (prev && h.p.w > prev.p.w) { out[out.length - 1] = h; lastEnd = h.e; }
        }
      });
      return out;
    }
    // Dashes are counted on their own, even inside a sentence trick, and drawn nested inside it.
    var prim = resolve(raw.filter(function (h) { return h.p.cat !== "punct"; }));
    var dash = resolve(raw.filter(function (h) { return h.p.cat === "punct"; }));
    var hits = prim.slice();
    dash.forEach(function (d) {
      var host = null;
      for (var i = 0; i < prim.length; i++) {
        var h = prim[i];
        if (d.s < h.e && d.e > h.s) { host = h; break; }
      }
      if (!host) hits.push(d);
      else if (d.s >= host.s && d.e <= host.e) { d.inner = true; hits.push(d); }
    });
    hits.sort(function (a, b) { return a.s - b.s || (a.inner ? 1 : 0) - (b.inner ? 1 : 0); });
    var units = countUnits(text, lang);
    var per = lang === "ja" ? 2000 : 1000, floor = lang === "ja" ? 200 : 100;
    var weight = 0, byCat = {}, byPat = {};
    hits.forEach(function (h) {
      weight += h.p.w;
      var c = byCat[h.p.cat] || (byCat[h.p.cat] = { n: 0, w: 0 });
      c.n++; c.w += h.p.w;
      var b = byPat[h.p.id] || (byPat[h.p.id] = { id: h.p.id, cat: h.p.cat, label: h.p.label, why: h.p.why, fix: h.p.fix, n: 0, w: 0, examples: [] });
      b.n++; b.w += h.p.w;
      if (b.examples.length < 3) b.examples.push(text.slice(h.s, h.e));
    });
    var score = units ? weight / Math.max(units, floor) * per : 0;
    var band = BANDS.filter(function (b) { return score < b.max; })[0];
    return {
      lang: lang, units: units, per: per, weight: weight,
      score: Math.round(score * 10) / 10, band: band,
      hits: hits.map(function (h) { return { s: h.s, e: h.e, id: h.p.id, cat: h.p.cat, w: h.p.w, inner: !!h.inner }; }),
      byCat: byCat,
      byPattern: Object.keys(byPat).map(function (k) { return byPat[k]; }).sort(function (a, b) { return b.w - a.w; })
    };
  }

  /* Simple swaps. Only word level changes that keep the meaning. Sentence tricks are left for a human. */
  var EN_FIX = [
    [/\s*\u2014\s*/g, ", "], [/\s\u2013\s/g, ", "], [/\s--\s/g, ", "],
    [/^\s*(?:Certainly|Absolutely|Of course|Sure|Great question|Great idea|Excellent question)[!,.]\s*/gim, ""],
    [/\s*\bI hope (?:this|that) (?:helps|clarifies|was helpful)[!.]?/gi, ""],
    [/^\s*here(?:'s| is) (?:a|an|the|your) (?:breakdown|summary|quick (?:summary|overview|breakdown)|overview)[^\n]*[.:]\s*$/gim, ""],
    [/\*\*([^*\n]{1,60})\*\*/g, function (m, a) { return a; }],
    [/\bit(?:'s| is) (?:important|crucial|essential|worth) (?:to )?(?:note|noting|remember|mention|mentioning|keep in mind)(?: that)?,?\s*/gi, ""],
    [/\b(?:in conclusion|in summary|to sum up|all in all|in essence),\s*/gi, ""],
    [/\b(?:moreover|furthermore|additionally),\s*/gi, "Also, "],
    [/\b(?:overall|ultimately|notably),\s*/gi, ""],
    [/\bin today'?s (?:fast[- ]paced|digital|modern|ever[- ]changing|rapidly evolving|interconnected) (?:world|age|landscape|era),?\s*/gi, ""],
    [/\bdelv(e|es|ed|ing) into\b/gi, function (m, a) { return { e: "look at", es: "looks at", ed: "looked at", ing: "looking at" }[a.toLowerCase()]; }],
    [/\bdelv(e|es|ed|ing)\b/gi, function (m, a) { return { e: "dig", es: "digs", ed: "dug", ing: "digging" }[a.toLowerCase()]; }],
    [/\butili[sz](e|es|ed|ing)\b/gi, function (m, a) { return { e: "use", es: "uses", ed: "used", ing: "using" }[a.toLowerCase()]; }],
    [/\bleverag(e|es|ed|ing)\b/gi, function (m, a) { return { e: "use", es: "uses", ed: "used", ing: "using" }[a.toLowerCase()]; }],
    [/\bshowcas(e|es|ed|ing)\b/gi, function (m, a) { return { e: "show", es: "shows", ed: "showed", ing: "showing" }[a.toLowerCase()]; }],
    [/\bunderscor(e|es|ed|ing)\b/gi, function (m, a) { return { e: "show", es: "shows", ed: "showed", ing: "showing" }[a.toLowerCase()]; }],
    [/\bfoster(s|ed|ing)?\b/gi, function (m, a) { return { "": "grow", s: "grows", ed: "grew", ing: "growing" }[(a || "").toLowerCase()]; }],
    [/\bembark(?:ing)? on\b/gi, "start"],
    [/\b(?:a (?:myriad|plethora|wide range|wide array|wide variety|diverse range) of)\b/gi, "many"],
    [/\bplays? an? (?:crucial|vital|pivotal|key|important|significant|central) role in\b/gi, function (m) { return /^plays/i.test(m) ? "matters for" : "matter for"; }],
    [/\b(?:is|stands as|serves as) a (?:true |powerful )?testament to\b/gi, "shows"],
    [/\bnavigat(?:e|ing) the (?:complexities|challenges|intricacies) of\b/gi, "handle"],
    [/\bin the (?:realm|world) of\b/gi, "in"],
    [/\bcrucial\b/gi, "key"], [/\bpivotal\b/gi, "key"], [/\bparamount\b/gi, "most important"],
    [/\bseamlessly\b/gi, "smoothly"], [/\bseamless\b/gi, "smooth"],
    [/\b(?:rich|vibrant|intricate|complex) tapestry of\b/gi, "mix of"], [/\btapestry\b/gi, "mix"],
    [/\bvibrant\b/gi, "lively"], [/\bboasts\b/gi, "has"], [/\bmeticulously\b/gi, "carefully"], [/\bmeticulous\b/gi, "careful"],
    [/\benhanc(e|es|ed|ing)\b/gi, function (m, a) { return { e: "improve", es: "improves", ed: "improved", ing: "improving" }[a.toLowerCase()]; }],
    [/\belevat(e|es|ed|ing)\b/gi, function (m, a) { return { e: "improve", es: "improves", ed: "improved", ing: "improving" }[a.toLowerCase()]; }],
    [/\bgame[- ]changer\b/gi, "big change"],
    [/\bfeel free to\b/gi, "you can"],
    [/\bin order to\b/gi, "to"],
    [/\b(?:let'?s |we'?ll )?(?:take a )?deep dive into\b/gi, "a close look at"],
    [/\b(?:let'?s )dive into\b/gi, "let's look at"]
  ];


  var JA_FIX = [
    [/^[ \t　]*(?:もちろんです|承知しました|かしこまりました|はい、承知しました)[！!。、]\s*/gm, ""],
    [/以下(?:に|のとおり|の通り)、?[^。\n]{0,30}(?:まとめ|整理|紹介)(?:ました|ます|しました|します|いたします)。\s*/g, ""],
    [/\s*(?:お役に立て|参考にな)(?:れば|たら)(?:幸いです|嬉しいです)。?/g, ""],
    [/いかがでした(?:でしょう)?か[？?。！!]?\s*/g, ""],
    [/(?:現代社会|デジタル時代|今日の(?:社会|世界))において、?/g, ""],
    [/(?:まとめると|要するに|結論として|以上のように|総合的に見ると)、/g, "つまり、"],
    [/総じて、/g, ""],
    [/することが(?:でき|可能)/g, function (m) { return /可能/.test(m) ? "でき" : "でき"; }],
    [/シームレスに/g, "スムーズに"], [/シームレスな/g, "スムーズな"],
    [/(?:鍵|カギ)となります/g, "大事です"], [/(?:鍵|カギ)となる/g, "大事な"], [/(?:鍵|カギ)になります/g, "大事です"],
    [/ぜひ、?/g, ""],
    [/\*\*([^*\n]{1,30})\*\*[：:]\s*/g, function (m, a) { return a + "。"; }],
    [/\*\*([^*\n]{1,60})\*\*/g, function (m, a) { return a; }],
    [/\s*(?:——|──|―{2}|—)\s*/g, "、"],
    [/(?:非常に|極めて)(重要|有効|効果的|魅力的|便利|強力)/g, function (m, a) { return "とても" + a; }]
  ];

  function keepCase(orig, rep) {
    if (!rep) return rep;
    if (orig && orig[0] === orig[0].toUpperCase() && orig[0] !== orig[0].toLowerCase()) return rep[0].toUpperCase() + rep.slice(1);
    return rep;
  }

  function fix(text, opts) {
    opts = opts || {};
    var lang = opts.lang && opts.lang !== "auto" ? opts.lang : detect(text);
    var rules = lang === "ja" ? JA_FIX : EN_FIX;
    var out = String(text || ""), changes = 0;
    rules.forEach(function (r) {
      out = out.replace(r[0], function () {
        var args = Array.prototype.slice.call(arguments);
        var m = args[0];
        var rep = typeof r[1] === "function" ? r[1].apply(null, args) : r[1];
        if (rep === undefined) return m;
        changes++;
        return lang === "en" ? keepCase(m, rep) : rep;
      });
    });
    if (lang === "en") {
      out = out
        .replace(/ ,/g, ",").replace(/,\s*,/g, ",").replace(/, ([.!?])/g, "$1").replace(/,\s*$/gm, ".")
        .replace(/([.!?]\s+|^)([a-z])/gm, function (m, a, b) { return a + b.toUpperCase(); })
        .replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").replace(/^\s+/, "");
    }
    return { text: out, changes: changes };
  }

  return { analyze: analyze, fix: fix, detect: detect, CATS: CATS, BANDS: BANDS, PATTERNS: P, version: "1.0.0" };
});
