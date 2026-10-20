# Patterns

Generated from `slop-check.js`. Weight is how much one hit adds to the score. The score is the weighted count per 1,000 English words, or per 2,000 Japanese characters, with short texts counted as at least 100 words or 200 characters.

## English, 91 patterns

### Dashes

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `emdash` | Em dash | 3 | Chatbots put an em dash where a comma or a period would do. One is fine. One every other sentence is a tell. | Use a comma or a period, or split the sentence. |

### Sentence tricks

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `notx_its` | It's not X, it's Y | 3 | The negative parallelism. It sets up a straw man just to knock it down, and models use it constantly. | Say the Y part directly. |
| `notonly` | Not only X but Y | 3 | Same trick in a longer form. It makes a plain point sound like a reveal. | Keep the stronger half. |
| `nonojust` | No X. No Y. Just Z. | 3 | Staccato ad copy. Very common in model written posts. | Write one normal sentence. |
| `rhetq` | Question, then the answer | 2 | A short question that the next sentence answers. It fakes suspense. | Just state the answer. |
| `whether` | Whether you're X or Y | 2 | Tries to address every reader at once. Nobody talks like this. | Pick the reader you actually mean. |
| `fromto` | From X to Y | 2 | A false range between two loosely related things, used to sound sweeping. | Name the one thing you mean. |
| `xnoty` | X, not Y | 2 | A slogan shaped sentence like a journey, not a destination. | Say the one thing you mean. |
| `three` | List of three | 0.5 | Models love groups of three. One list means nothing. Every list being three is the tell. | Use two, or four, or the one that matters. |

### Stock phrases

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `important_note` | It's worth noting | 2 | Filler that announces a point instead of making it. | Delete it and keep the point. |
| `todays_world` | In today's fast paced world | 2 | A stock opener that says nothing. | Start with the actual point. |
| `ever_evolving` | Ever evolving | 2 | Vague motion words that make anything sound important. | Say what changed. |
| `plays_role` | Plays a crucial role | 2 | Inflated way to say something matters. | Say how it matters. |
| `testament` | A testament to | 2 | Grand phrase models reach for. | Say it shows. |
| `tapestry` | Rich tapestry | 2 | Classic model flourish. | Say mix or range, or cut it. |
| `navigate` | Navigate the complexities | 2 | Abstract travel metaphor. | Say handle or deal with. |
| `realm` | In the realm of | 2 | Padding before the noun. | Just say in. |
| `unlock` | Unlock the potential | 2 | Ad copy. | Say what it lets you do. |
| `nextlevel` | Take it to the next level | 2 | Ad copy. | Say what gets better. |
| `endofday` | At the end of the day | 1 | Filler. | Cut it. |
| `whenitcomes` | When it comes to | 1 | Filler before the topic. | Name the topic directly. |
| `diveinto` | Dive into | 2 | Chatbot favourite for starting anything. | Say look at. |
| `gamechanger` | Game changer | 2 | Hype word. | Say what changes. |
| `herethething` | Here's the thing | 2 | Signpost that delays the point. | Make the point. |
| `letsinkin` | Let that sink in | 2 | Thread bait signposts. | Cut it. |
| `conclusion` | In conclusion | 2 | Compulsive summary. Short texts don't need one. | End on the last real point. |
| `transitions` | Moreover, furthermore | 1 | Essay connectors that pile up in model text. | Use and, also, or nothing. |
| `thatbeing` | That being said | 1 | Filler transition. | Cut it. |
| `myriad` | A myriad of | 1 | Padding for many. | Say many, or the number. |
| `journey` | Embark on a journey | 2 | Everything is a journey to a model. | Say start. |
| `harness` | Harness the power of | 1 | Hype padding. | Say use. |
| `reminder` | A powerful reminder | 2 | Grand phrase. | Say it shows. |
| `paveway` | Pave the way | 1 | Stock phrase. | Say it plainly. |
| `lookfurther` | Look no further | 2 | Marketing voice. | Say what it does. |

### Pet words

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `w_delve` | delve | 2 | Delves up 28 times in 2024 papers in one study. The best known model word. | look at, dig into |
| `w_tapestry` | tapestry | 1.5 | Flowery word models overuse. | mix |
| `w_testament` | testament | 1 | Overused for shows. | sign |
| `w_underscore` | underscore | 1 | Up about 11 times in 2024 papers in one study. | shows |
| `w_showcase` | showcase | 1 | Up about 10 times in 2024 papers in one study. | show |
| `w_pivotal` | pivotal | 1 | Inflated importance. | key |
| `w_crucial` | crucial | 1 | Inflated importance. | key, needed |
| `w_intricate` | intricate | 1 | Model favourite. | detailed |
| `w_multifaceted` | multifaceted | 1 | Says complex without saying how. | say how |
| `w_foster` | foster | 1 | Model favourite. | build, grow |
| `w_enhance` | enhance | 0.5 | Common in model text. | improve |
| `w_seamless` | seamless | 1 | Marketing word. | smooth |
| `w_robust` | robust | 0.5 | Model favourite. | solid |
| `w_leverage` | leverage | 1 | Business padding. | use |
| `w_utilize` | utilize | 1 | Long word for use. | use |
| `w_realm` | realm | 1 | Fantasy word in plain writing. | area |
| `w_vibrant` | vibrant | 1 | Model favourite. | lively |
| `w_nestled` | nestled | 1 | Travel copy cliche. | set |
| `w_boasts` | boasts | 1 | Brochure verb. | has |
| `w_unwavering` | unwavering | 1 | Model favourite. | steady |
| `w_holistic` | holistic | 1 | Vague. | whole |
| `w_transformative` | transformative | 1 | Hype word. | say what changes |
| `w_empower` | empower | 1 | Hype word. | help, let |
| `w_elevate` | elevate | 1 | Marketing verb. | improve |
| `w_meticulous` | meticulous | 1 | Model favourite. | careful |
| `w_commendable` | commendable | 1 | Inflated praise. | good, useful |
| `w_paramount` | paramount | 1 | Inflated importance. | most important |
| `w_bustling` | bustling | 1 | Travel copy cliche. | busy |
| `w_beacon` | beacon | 1 | Flowery. | example |
| `w_symphony` | symphony | 1 | Flowery. | mix |
| `w_resonate` | resonate | 1 | Model favourite. | connect, land |
| `w_harness` | harness | 0.5 | Model favourite. | use |
| `w_streamline` | streamline | 0.5 | Business padding. | simplify |
| `w_landscape` | landscape | 0.5 | Used for any field or market. | field, market |
| `w_navigate` | navigate | 0.5 | Used for any difficulty. | handle |
| `w_embark` | embark | 1 | Used for any start. | start |
| `w_cornerstone` | cornerstone | 1 | Flowery. | base |
| `w_interplay` | interplay | 1 | Model favourite. | mix |
| `w_captivating` | captivating | 1 | Model favourite. | say what you saw |
| `w_profound` | profound | 0.5 | Inflated. | deep, big |
| `w_bolster` | bolster | 1 | News speak models copy. | boost, lead, get |
| `w_unleash` | unleash | 1 | Hype word. | release |
| `w_tailored` | tailored | 0.5 | Marketing word. | made for |
| `w_comprehensive` | comprehensive | 0.5 | Model favourite. | full |
| `w_insightful` | insightful | 1 | Inflated praise. | useful |
| `w_dynamic` | dynamic | 0.5 | Vague. | say how |
| `w_journey` | journey | 0.5 | Everything is a journey to a model. | say what it is |

### Chatbot leftovers

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `certainly` | Certainly! | 3 | Chatbot greeting pasted straight into the text. | Delete it. |
| `hopehelps` | I hope this helps | 3 | Chatbot sign off. | Delete it. |
| `feelfree` | Feel free to | 2 | Assistant voice. Fine in support email, odd in a post. | Cut it or say it your way. |
| `asanai` | As an AI | 5 | Model disclaimer left in the text. | Delete it. |
| `heresa` | Here's a breakdown | 2 | Assistant handing over a draft. | Start with the content. |
| `artifact` | Copy and paste residue | 5 | Citation markers from the ChatGPT window. About as sure a sign as it gets. | Delete them. |
| `findswell` | Hope this email finds you well | 2 | Template opener. Humans use it too, models use it always. | Start with why you are writing. |

### Formatting

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `bold` | Bold everywhere | 1 | Bolded key terms in every line, pasted from a chat window. | Remove the stars. |
| `emojihead` | Emoji bullets | 1 | Rocket and sparkle emoji at the start of lines, the thread template look. | Use plain lines. |
| `arrow` | Arrows | 0.5 | Arrows used as bullets or as therefore. | Use words. |

## 日本語, 51 patterns

### 記号の癖

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `ja_dash` | ダッシュ「—」 | 2 | 英語から持ち込まれたダッシュです。小説の「――」は普通の用法です。 | 読点、句点、改行にする |

### 構文の癖

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `ja_ieru` | 〜と言えるでしょう | 2.5 | 根拠のない、ぼかした結論です。 | 「〜です」か「〜だと思う」 |
| `ja_nodehanai` | 〜のではないでしょうか | 2 | やわらかい断定、または硬すぎる強調です。 | 言い切るか「〜だと思う」 |
| `ja_juuyou` | 〜することが大切です | 2 | 教科書のようなお説教です。 | 理由を書くか、文ごと削除する |
| `ja_juuyounoha` | 重要なのは〜 | 1.5 | 要点を言う前に予告しています。 | 要点を直接書く |
| `ja_dakedenaku` | 〜だけでなく〜も | 2.5 | 「XではなくY」型の対比で盛り上げる癖です。 | 言いたい方だけ直接書く |
| `ja_dehanaku` | 〜ではなく、〜 | 1 | 英語の not X but Y を直訳したような対比です。 | 言いたい方だけ書く |
| `ja_kaginaru` | 〜が鍵となります | 2 | 決まり文句の比喩です。 | 何が必要かを書く |
| `ja_npoint` | 3つのポイント | 1.5 | なんでも数をそろえてまとめる癖です。 | 数を決めずに書く |
| `ja_rhetq` | なぜでしょうか？それは | 2 | 自分で問いを立てて自分で答える型です。 | 直接述べる |
| `ja_korenoyori` | これにより | 1 | 人はあまり使わない、硬いつなぎの言葉です。 | 「そのため」か、文をつなぐ |
| `ja_shimesu` | 〜ことを示している | 1.5 | 論文を直訳したような言い回しです。 | 「〜だろう」と書き、出典を添える |
| `ja_dekiru` | 〜することができます | 1 | 英語の直訳調の回りくどさです。 | 「〜できます」 |
| `ja_kanten` | 〜という観点から | 1 | 水増しの言い回しです。 | 削除するか「〜で見ると」 |
| `ja_ikkai` | 一概には言えません | 2 | 立場を決めずに逃げる型です。 | 立場を一つ決めて根拠を添える |
| `ja_kangaerareru` | 〜と考えられます | 1 | 主語のない、ぼかした言い方です。 | 「私は〜と思う。理由は〜」 |
| `ja_mazusaisho` | まず最初に | 1 | 手順書のような並べ方です。 | 「まず」か、自然な流れで書く |

### 定型句

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `ja_ikaga` | いかがでしたか | 3 | 情報のない締めの一文です。AI以前のまとめブログ時代からある定型です。 | 削除し、具体的な一文で終える |
| `ja_honkiji` | 本記事では〜を解説します | 2 | 中身の前に構成を予告する書き出しです。 | いきなり本題から書く |
| `ja_kaisetsu` | 〜を解説していきます | 2 | 見出しを読めば分かることを繰り返す前置きです。 | 削除して一つ目の内容を書く |
| `ja_kinen` | 現代社会において | 2 | どんな話題にも使える、時代から入る書き出しです。 | 具体的な数字や自分の体験から書く |
| `ja_nayami` | 〜で悩んでいませんか | 2 | 広告の呼び込みの型です。 | 事実か意見から書き出す |
| `ja_ketsuron` | 結論から言うと | 1 | 前置きの決まり文句です。 | そのまま結論を書く |
| `ja_matome` | まとめると、 | 2 | 型どおりのまとめです。 | 「つまり」にするか削除する |
| `ja_zehi` | ぜひ試してみてください | 1.5 | 儀式のような呼びかけです。 | 1記事に1回まで |
| `ja_kanosei` | 大きな可能性を秘めています | 2 | 中身のない、未来に向けた締めです。 | 次の具体的な予定や数字を書く |
| `ja_yakuwari` | 重要な役割を果たす | 2 | 役割を大げさに言う定型です。 | 何をするのかを書く |
| `ja_kachi` | 新たな価値を創出 | 1.5 | PR文の決まり文句です。 | 誰に何の得があるかを書く |

### AIがよく使う語

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `ja_seamless` | シームレス | 1.5 | カタカナの流行語です。 | 途切れずに、スムーズに |
| `ja_hype` | 革命的 | 1.5 | 誇大な言葉です。 | 何がどう変わったかを書く |
| `ja_abstract` | 画期的 | 1 | 中身のない評価語です。 | 何がどう変わったかを書く |
| `ja_kaizoudo` | 解像度が上がる | 1.5 | 理解や手触りを装う言葉です。最近のAIの文章によく出ます。 | どこが分かったのかを具体的に書く |
| `ja_metaphor` | 羅針盤 | 1.5 | 型どおりの比喩です。 | 具体的に書く |
| `ja_samazama` | さまざまな | 0.5 | あいまいな量の言い方です。人もよく使うので軽く数えます。 | 具体例を2つ挙げる |
| `ja_tekisetsu` | 適切な | 0.5 | 何が適切かを書いていない言葉です。 | 基準や数字を書く |
| `ja_hijouni` | 非常に重要 | 1 | 根拠のない強調です。 | 根拠を一つ添える |
| `ja_newgen` | 静かに壊れる | 1 | 2025年以降のモデルの文章に増えた言い回しです。 | 何が起きるかをそのまま書く |
| `ja_katakana` | ナレッジ | 1 | 日本語で言えるのにカタカナ語を使っています。 | 知識、文脈、優先度など |
| `ja_dodai` | 土台 | 0.5 | AI以後に急に増えた語のひとつです。 | 基本、基礎 |

### チャットボットの名残

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `ja_mochiron` | もちろんです！ | 3 | AIへの指示に答えた返事が、そのまま残っています。 | 削除して中身から書く |
| `ja_ikani` | 以下にまとめました | 2 | チャットの返答の決まり文句です。 | 削除して本題から書く |
| `ja_question` | 素晴らしい質問ですね | 3 | お世辞から入るAIの返答です。 | 削除して答えから書く |
| `ja_yakunitate` | お役に立てれば幸いです | 3 | チャットボットとブログの締めの定型句です。 | 削除する |
| `ja_kigaru` | お気軽にお尋ねください | 3 | チャットの締めの申し出です。 | 削除する |
| `ja_cutoff` | 知識のカットオフ | 4 | モデルの断り書きが残っています。 | 削除し、必要なら確認した日付を書く |
| `ja_artifact` | コピペの痕跡 | 5 | ChatGPTの引用表示の残骸です。ほぼ確実な痕跡です。 | 削除する |

### 書式

| id | label | weight | why | try |
| --- | --- | --- | --- | --- |
| `ja_labelcolon` | **見出し**：説明 | 2 | 太字のラベルとコロンで並べる、AIの典型的な書式です。 | 文章に溶かす |
| `ja_colonend` | 〜は次のとおりです： | 1.5 | 英語の as follows: をそのまま持ち込んだ癖です。 | 「次のとおりです。」 |
| `ja_bold` | 太字だらけ | 1 | チャット画面の太字記号がそのまま残っています。 | 記号を外す |
| `ja_emojihead` | 絵文字の箇条書き | 1 | ✅や🚀で始まる行。AIの投稿テンプレートの見た目です。 | 普通の行にする |
| `ja_mdhead` | Markdownの見出し記号 | 1 | 見出し記号がそのまま残っています。 | 記号を外す |

## Sources

English
- Erik Markus Kannike, qwen3-4b-deslop write up, 2026: https://100toolkit.com/blog/deslop-model/
- Kobak, González-Márquez, Horvát, Lause, Delving into ChatGPT usage in academic writing through excess vocabulary: https://arxiv.org/abs/2406.07016
- Wikipedia, Signs of AI writing, WikiProject AI Cleanup: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- Sam Paech, antislop sampler, the not X but Y regex: https://github.com/sam-paech/antislop-sampler

日本語
- textlint-rule-preset-ai-writing, textlint-ja: https://github.com/textlint-ja/textlint-rule-preset-ai-writing
- stop-ai-slop-jp, iKora128: https://github.com/iKora128/stop-ai-slop-jp
- ja-writing-guard, TakeshiTGAL: https://github.com/TakeshiTGAL/hermes-plugin-ja-writing-guard
- 逆瀬川ちゃん, 生成AI以前と以後でエンジニアの文章はどう変わったのか, Qiitaの7万記事を数えてみた話, 2026-09-11: https://nyosegawa.com/posts/qiita-writing-before-after-ai/
- Fyve, 「AIっぽい文章の特徴」は本当か, 実測で検証する, 2026-09-04: https://fyve.co.jp/ai-advisor/articles/ai-text-detection-myths-japan
- 山城博規, GMO天秤AI, AIくささを消す, 2026-04-10: https://tenbin.ai/media/ai_tips/ai-writing-remove-ai-slop
- 飯田一史, PRESIDENT Online, 2026-10-09: https://president.jp/articles/-/119779

The regular expressions here are our own. The lists above were used to decide which habits to include.
