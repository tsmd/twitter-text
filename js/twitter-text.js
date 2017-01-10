/**
 * @file twitter-text.js
 * Originally created by Twitter, Inc.
 * Modified by Takayuki Shimada <taka@tsmd.jp>
 */
(function() {
  if (typeof twttr === "undefined" || twttr === null) {
    var twttr = {};
  }

  twttr.txt = {};
  twttr.txt.regexen = {};

  // Builds a RegExp
  function regexSupplant(regex, flags) {
    flags = flags || "";
    if (typeof regex !== "string") {
      if (regex.global && flags.indexOf("g") < 0) {
        flags += "g";
      }
      if (regex.ignoreCase && flags.indexOf("i") < 0) {
        flags += "i";
      }
      if (regex.multiline && flags.indexOf("m") < 0) {
        flags += "m";
      }

      regex = regex.source;
    }

    return new RegExp(regex.replace(/#\{(\w+)\}/g, function(match, name) {
      var newRegex = twttr.txt.regexen[name] || "";
      if (typeof newRegex !== "string") {
        newRegex = newRegex.source;
      }
      return newRegex;
    }), flags);
  }

  twttr.txt.regexSupplant = regexSupplant;

  // simple string interpolation
  function stringSupplant(str, values) {
    return str.replace(/#\{(\w+)\}/g, function(match, name) {
      return values[name] || "";
    });
  }

  twttr.txt.stringSupplant = stringSupplant;

  twttr.txt.regexen.spaces_group = /\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000/;
  twttr.txt.regexen.spaces = regexSupplant(/[#{spaces_group}]/);
  twttr.txt.regexen.invalid_chars_group = /\uFFFE\uFEFF\uFFFF\u202A-\u202E/;
  twttr.txt.regexen.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/;
  twttr.txt.regexen.non_bmp_code_pairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/mg;

  twttr.txt.regexen.latinAccentChars = /\xC0-\xD6\xD8-\xF6\xF8-\xFF\u0100-\u024F\u0253\u0254\u0256\u0257\u0259\u025B\u0263\u0268\u026F\u0272\u0289\u028B\u02BB\u0300-\u036F\u1E00-\u1EFF/;

  // URL related regex collection
  twttr.txt.regexen.validUrlPrecedingChars = regexSupplant(/(?:[^A-Za-z0-9@＠$#＃#{invalid_chars_group}]|^)/);
  twttr.txt.regexen.invalidUrlWithoutProtocolPrecedingChars = /[-_.\/]$/;
  twttr.txt.regexen.invalidDomainChars = stringSupplant("#{punct}#{spaces_group}#{invalid_chars_group}", twttr.txt.regexen);
  twttr.txt.regexen.validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/);
  twttr.txt.regexen.validSubdomain = regexSupplant(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/);
  twttr.txt.regexen.validDomainName = regexSupplant(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/);
  twttr.txt.regexen.validGTLD = regexSupplant(RegExp(
'(?:(?:' +
    '삼성|닷컴|닷넷|香格里拉|餐厅|食品|飞利浦|電訊盈科|集团|通販|购物|谷歌|诺基亚|联通|网络|网站|网店|网址|组织机构|移动|珠宝|点看|游戏|淡马锡|机构|書籍|时尚|新闻|政府|' +
    '政务|手表|手机|我爱你|慈善|微博|广东|工行|家電|娱乐|天主教|大拿|大众汽车|在线|嘉里大酒店|嘉里|商标|商店|商城|公益|公司|八卦|健康|信息|佛山|企业|中文网|中信|世界|' +
    'ポイント|ファッション|セール|ストア|コム|グーグル|クラウド|みんな|คอม|संगठन|नेट|कॉम|همراه|موقع|موبايلي|كوم|كاثوليك|شبكة|بيتك|' +
    'بازار|العليان|ارامكو|ابوظبي|קום|сайт|рус|орг|онлайн|москва|ком|католик|дети|zuerich|zone|zippo|' +
    'zip|zero|zara|zappos|yun|youtube|you|yokohama|yoga|yodobashi|yandex|yamaxun|yahoo|yachts|xyz|' +
    'xxx|xperia|xin|xihuan|xfinity|xerox|xbox|wtf|wtc|wow|world|works|work|woodside|wolterskluwer|' +
    'wme|winners|wine|windows|win|williamhill|wiki|wien|whoswho|weir|weibo|wedding|wed|website|weber|' +
    'webcam|weatherchannel|weather|watches|watch|warman|wanggou|wang|walter|walmart|wales|vuelos|' +
    'voyage|voto|voting|vote|volvo|volkswagen|vodka|vlaanderen|vivo|viva|vistaprint|vista|vision|' +
    'visa|virgin|vip|vin|villas|viking|vig|video|viajes|vet|versicherung|vermögensberatung|' +
    'vermögensberater|verisign|ventures|vegas|vanguard|vana|vacations|ups|uol|uno|university|unicom|' +
    'uconnect|ubs|ubank|tvs|tushu|tunes|tui|tube|trv|trust|travelersinsurance|travelers|' +
    'travelchannel|travel|training|trading|trade|toys|toyota|town|tours|total|toshiba|toray|top|' +
    'tools|tokyo|today|tmall|tkmaxx|tjx|tjmaxx|tirol|tires|tips|tiffany|tienda|tickets|tiaa|theatre|' +
    'theater|thd|teva|tennis|temasek|telefonica|telecity|tel|technology|tech|team|tdk|tci|taxi|tax|' +
    'tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|systems|symantec|sydney|swiss|swiftcover|' +
    'swatch|suzuki|surgery|surf|support|supply|supplies|sucks|style|study|studio|stream|store|' +
    'storage|stockholm|stcgroup|stc|statoil|statefarm|statebank|starhub|star|staples|stada|srt|srl|' +
    'spreadbetting|spot|spiegel|space|soy|sony|song|solutions|solar|sohu|software|softbank|social|' +
    'soccer|sncf|smile|smart|sling|skype|sky|skin|ski|site|singles|sina|silk|shriram|showtime|show|' +
    'shouji|shopping|shop|shoes|shiksha|shia|shell|shaw|sharp|shangrila|sfr|sexy|sex|sew|seven|ses|' +
    'services|sener|select|seek|security|secure|seat|scot|scor|scjohnson|science|schwarz|schule|' +
    'school|scholarships|schmidt|schaeffler|scb|sca|sbs|sbi|saxo|save|sas|sarl|sapo|sap|sanofi|' +
    'sandvikcoromant|sandvik|samsung|samsclub|salon|sale|sakura|safety|safe|saarland|ryukyu|rwe|run|' +
    'ruhr|rsvp|room|rogers|rodeo|rocks|rocher|rmit|rip|rio|ril|rightathome|ricoh|richardli|rich|' +
    'rexroth|reviews|review|restaurant|rest|republican|report|repair|rentals|rent|ren|reliance|reit|' +
    'reisen|reise|rehab|redumbrella|redstone|red|recipes|realty|realtor|realestate|read|raid|radio|' +
    'racing|qvc|quest|quebec|qpon|pwc|pub|prudential|pru|protection|property|properties|promo|' +
    'progressive|prof|productions|prod|pro|prime|press|praxi|pramerica|post|porn|politie|poker|pohl|' +
    'pnc|plus|plumbing|playstation|play|place|pizza|pioneer|pink|ping|pin|pid|pictures|pictet|pics|' +
    'piaget|physio|photos|photography|photo|phone|philips|pharmacy|pfizer|pet|pccw|pay|passagens|' +
    'party|parts|partners|pars|paris|panerai|panasonic|pamperedchef|page|ovh|ott|otsuka|osaka|' +
    'origins|orientexpress|organic|org|orange|oracle|open|ooo|onyourside|online|onl|ong|one|omega|' +
    'ollo|oldnavy|olayangroup|olayan|okinawa|office|off|observer|obi|nyc|ntt|nrw|nra|nowtv|nowruz|' +
    'now|norton|northwesternmutual|nokia|nissay|nissan|ninja|nikon|nike|nico|nhk|ngo|nfl|nexus|' +
    'nextdirect|next|news|newholland|new|neustar|network|netflix|netbank|net|nec|nba|navy|natura|' +
    'nationwide|name|nagoya|nadex|nab|mutuelle|mutual|museum|mtr|mtpc|mtn|msd|movistar|movie|mov|' +
    'motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|monash|mom|moi|moe|moda|' +
    'mobily|mobile|mobi|mma|mls|mlb|mitsubishi|mit|mint|mini|mil|microsoft|miami|metlife|meo|menu|' +
    'men|memorial|meme|melbourne|meet|media|med|mckinsey|mcdonalds|mcd|mba|mattel|maserati|marshalls|' +
    'marriott|markets|marketing|market|mango|management|man|makeup|maison|maif|madrid|macys|luxury|' +
    'luxe|lupin|lundbeck|ltda|ltd|lplfinancial|lpl|love|lotto|lotte|london|lol|loft|locus|locker|' +
    'loans|loan|lixil|living|live|lipsy|link|linde|lincoln|limo|limited|lilly|like|lighting|' +
    'lifestyle|lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|lefrak|leclerc|lease|lds|lawyer|' +
    'law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|lancia|lancaster|lamer|' +
    'lamborghini|ladbrokes|lacaixa|kyoto|kuokgroup|kred|krd|kpn|kpmg|kosher|komatsu|koeln|kiwi|' +
    'kitchen|kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|kerryhotels|kddi|kaufen|' +
    'juniper|juegos|jprs|jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jio|jewelry|jetzt|jeep|jcp|jcb|' +
    'java|jaguar|iwc|iveco|itv|itau|istanbul|ist|ismaili|iselect|irish|ipiranga|investments|intuit|' +
    'international|intel|int|insure|insurance|institute|ink|ing|info|infiniti|industries|immobilien|' +
    'immo|imdb|imamat|ikano|iinet|ifm|ieee|icu|ice|icbc|ibm|hyundai|hyatt|hughes|htc|hsbc|how|house|' +
    'hotmail|hoteles|hot|hosting|host|hospital|horse|honeywell|honda|homesense|homes|homegoods|' +
    'homedepot|holiday|holdings|hockey|hkt|hiv|hitachi|hisamitsu|hiphop|hgtv|hermes|here|helsinki|' +
    'help|healthcare|health|hdfcbank|hdfc|hbo|haus|hangout|hamburg|hair|guru|guitars|guide|guge|' +
    'gucci|guardian|group|gripe|green|gratis|graphics|grainger|gov|got|gop|google|goog|goodyear|' +
    'goodhands|goo|golf|goldpoint|gold|godaddy|gmx|gmo|gmbh|gmail|globo|global|gle|glass|glade|' +
    'giving|gives|gifts|gift|ggee|george|genting|gent|gea|gdn|gbiz|garden|gap|games|game|gallup|' +
    'gallo|gallery|gal|fyi|futbol|furniture|fund|fun|fujixerox|fujitsu|ftr|frontier|frontdoor|' +
    'frogans|frl|fresenius|free|fox|foundation|forum|forsale|forex|ford|football|foodnetwork|food|' +
    'foo|fly|flsmidth|flowers|florist|flir|flights|flickr|fitness|fit|fishing|fish|firmdale|' +
    'firestone|fire|financial|finance|final|film|fido|fidelity|fiat|ferrero|ferrari|feedback|fedex|' +
    'fast|fashion|farmers|farm|fans|fan|family|faith|fairwinds|fail|fage|extraspace|express|exposed|' +
    'expert|exchange|everbank|events|eus|eurovision|esurance|estate|esq|erni|ericsson|equipment|' +
    'epson|epost|enterprises|engineering|engineer|energy|emerck|email|education|edu|edeka|eco|eat|' +
    'earth|dvr|dvag|durban|dupont|duns|dunlop|duck|dubai|dtv|drive|download|dot|doosan|domains|doha|' +
    'dog|dodge|doctor|docs|dnp|diy|dish|discover|discount|directory|direct|digital|diet|diamonds|dhl|' +
    'dev|design|desi|dentist|dental|democrat|delta|deloitte|dell|delivery|degree|deals|dealer|deal|' +
    'dds|dclk|day|datsun|dating|date|data|dance|dad|dabur|cyou|cymru|cuisinella|csc|cruises|cruise|' +
    'crs|crown|cricket|creditunion|creditcard|credit|courses|coupons|coupon|country|corsica|coop|' +
    'cool|cookingchannel|cooking|contractors|contact|consulting|construction|condos|comsec|computer|' +
    'compare|company|community|commbank|comcast|com|cologne|college|coffee|codes|coach|clubmed|club|' +
    'cloud|clothing|clinique|clinic|click|cleaning|claims|cityeats|city|citic|citi|citadel|cisco|' +
    'circle|cipriani|church|chrysler|chrome|christmas|chloe|chintai|cheap|chat|chase|channel|chanel|' +
    'cfd|cfa|cern|ceo|center|ceb|cbs|cbre|cbn|cba|catholic|catering|cat|casino|cash|caseih|case|casa|' +
    'cartier|cars|careers|career|care|cards|caravan|car|capitalone|capital|capetown|canon|' +
    'cancerresearch|camp|camera|cam|calvinklein|call|cal|cafe|cab|bzh|buzz|buy|business|builders|' +
    'build|bugatti|budapest|brussels|brother|broker|broadway|bridgestone|bradesco|box|boutique|bot|' +
    'boston|bostik|bosch|boots|booking|book|boo|bond|bom|bofa|boehringer|boats|bnpparibas|bnl|bmw|' +
    'bms|blue|bloomberg|blog|blockbuster|blanco|blackfriday|black|biz|bio|bingo|bing|bike|bid|bible|' +
    'bharti|bet|bestbuy|best|berlin|bentley|beer|beauty|beats|bcn|bcg|bbva|bbt|bbc|bayern|bauhaus|' +
    'basketball|baseball|bargains|barefoot|barclays|barclaycard|barcelona|bar|bank|band|' +
    'bananarepublic|banamex|baidu|baby|azure|axa|aws|avianca|autos|auto|author|auspost|audio|audible|' +
    'audi|auction|attorney|athleta|associates|asia|asda|arte|art|arpa|army|archi|aramco|aquarelle|' +
    'apple|app|apartments|aol|anz|anquan|android|analytics|amsterdam|amica|amfam|amex|americanfamily|' +
    'americanexpress|alstom|alsace|ally|allstate|allfinanz|alipay|alibaba|alfaromeo|akdn|airtel|' +
    'airforce|airbus|aigo|aig|agency|agakhan|afl|afamilycompany|aetna|aero|aeg|adult|ads|adac|actor|' +
    'active|aco|accountants|accountant|accenture|academy|abudhabi|abogado|able|abc|abbvie|abbott|abb|' +
    'abarth|aarp|aaa|onion' +
')(?=[^0-9a-zA-Z@]|$))'));
  twttr.txt.regexen.validCCTLD = regexSupplant(RegExp(
'(?:(?:' +
    '한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|ਭਾਰਤ|' +
    'ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|مليسيا|مصر|قطر|فلسطين|عمان|عراق|سورية|سودان|تونس|' +
    'بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|الاردن|հայ|қаз|укр|срб|рф|мон|мкд|ею|бел|бг|ελ|' +
    'zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|tt|tr|tp|to|tn|tm|tl|tk|' +
    'tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|se|sd|sc|sb|sa|rw|ru|rs|ro|' +
    're|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|nl|ni|ng|nf|ne|nc|na|mz|my|mx|' +
    'mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|' +
    'ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|' +
    'gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|' +
    'do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|' +
    'bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac' +
')(?=[^0-9a-zA-Z@]|$))'));
  twttr.txt.regexen.validPunycode = /(?:xn--[0-9a-z]+)/;
  twttr.txt.regexen.validSpecialCCTLD = /(?:(?:co|tv)(?=[^0-9a-zA-Z@]|$))/;
  twttr.txt.regexen.validDomain = regexSupplant(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/);
  twttr.txt.regexen.validAsciiDomain = regexSupplant(/(?:(?:[\-a-z0-9#{latinAccentChars}]+)\.)+(?:#{validGTLD}|#{validCCTLD}|#{validPunycode})/gi);
  twttr.txt.regexen.invalidShortDomain = regexSupplant(/^#{validDomainName}#{validCCTLD}$/i);
  twttr.txt.regexen.validSpecialShortDomain = regexSupplant(/^#{validDomainName}#{validSpecialCCTLD}$/i);
  twttr.txt.regexen.validPortNumber = /[0-9]+/;
  twttr.txt.regexen.cyrillicLettersAndMarks = /\u0400-\u04FF/;
  twttr.txt.regexen.validGeneralUrlPathChars = regexSupplant(/[a-z#{cyrillicLettersAndMarks}0-9!\*';:=\+,\.\$\/%#\[\]\-_~@\|&#{latinAccentChars}]/i);
  // Allow URL paths to contain up to two nested levels of balanced parens
  //  1. Used in Wikipedia URLs like /Primer_(film)
  //  2. Used in IIS sessions like /S(dfd346)/
  //  3. Used in Rdio URLs like /track/We_Up_(Album_Version_(Edited))/
  twttr.txt.regexen.validUrlBalancedParens = regexSupplant(
    '\\('                                   +
      '(?:'                                 +
        '#{validGeneralUrlPathChars}+'      +
        '|'                                 +
        // allow one nested level of balanced parentheses
        '(?:'                               +
          '#{validGeneralUrlPathChars}*'    +
          '\\('                             +
            '#{validGeneralUrlPathChars}+'  +
          '\\)'                             +
          '#{validGeneralUrlPathChars}*'    +
        ')'                                 +
      ')'                                   +
    '\\)'
  , 'i');
  // Valid end-of-path chracters (so /foo. does not gobble the period).
  // 1. Allow =&# for empty URL parameters and other URL-join artifacts
  twttr.txt.regexen.validUrlPathEndingChars = regexSupplant(/[\+\-a-z#{cyrillicLettersAndMarks}0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i);
  // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user/
  twttr.txt.regexen.validUrlPath = regexSupplant('(?:' +
    '(?:' +
      '#{validGeneralUrlPathChars}*' +
        '(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*' +
        '#{validUrlPathEndingChars}'+
      ')|(?:@#{validGeneralUrlPathChars}+\/)'+
    ')', 'i');

  twttr.txt.regexen.validUrlQueryChars = /[a-z0-9!?\*'@\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;
  twttr.txt.regexen.validUrlQueryEndingChars = /[a-z0-9_&=#\/]/i;
  twttr.txt.regexen.extractUrl = regexSupplant(
    '('                                                            + // $1 total match
      '(#{validUrlPrecedingChars})'                                + // $2 Preceeding chracter
      '('                                                          + // $3 URL
        '(https?:\\/\\/)?'                                         + // $4 Protocol (optional)
        '(#{validDomain})'                                         + // $5 Domain(s)
        '(?::(#{validPortNumber}))?'                               + // $6 Port number (optional)
        '(\\/#{validUrlPath}*)?'                                   + // $7 URL Path
        '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?'  + // $8 Query String
      ')'                                                          +
    ')'
  , 'gi');

  twttr.txt.regexen.validTcoUrl = /^https?:\/\/t\.co\/[a-z0-9]+/i;
  twttr.txt.regexen.urlHasHttps = /^https:\/\//i;

  twttr.txt.extractUrlsWithIndices = function(text, options) {
    if (!options) {
      options = {extractUrlsWithoutProtocol: true};
    }
    if (!text || (options.extractUrlsWithoutProtocol ? !text.match(/\./) : !text.match(/:/))) {
      return [];
    }

    var urls = [];

    while (twttr.txt.regexen.extractUrl.exec(text)) {
      var before = RegExp.$2, url = RegExp.$3, protocol = RegExp.$4, domain = RegExp.$5, path = RegExp.$7;
      var endPosition = twttr.txt.regexen.extractUrl.lastIndex,
          startPosition = endPosition - url.length;

      // if protocol is missing and domain contains non-ASCII characters,
      // extract ASCII-only domains.
      if (!protocol) {
        if (!options.extractUrlsWithoutProtocol
            || before.match(twttr.txt.regexen.invalidUrlWithoutProtocolPrecedingChars)) {
          continue;
        }
        var lastUrl = null,
            asciiEndPosition = 0;
        domain.replace(twttr.txt.regexen.validAsciiDomain, function(asciiDomain) {
          var asciiStartPosition = domain.indexOf(asciiDomain, asciiEndPosition);
          asciiEndPosition = asciiStartPosition + asciiDomain.length;
          lastUrl = {
            url: asciiDomain,
            indices: [startPosition + asciiStartPosition, startPosition + asciiEndPosition]
          };
          if (path
              || asciiDomain.match(twttr.txt.regexen.validSpecialShortDomain)
              || !asciiDomain.match(twttr.txt.regexen.invalidShortDomain)) {
            urls.push(lastUrl);
          }
        });

        // no ASCII-only domain found. Skip the entire URL.
        if (lastUrl == null) {
          continue;
        }

        // lastUrl only contains domain. Need to add path and query if they exist.
        if (path) {
          lastUrl.url = url.replace(domain, lastUrl.url);
          lastUrl.indices[1] = endPosition;
        }
      } else {
        // In the case of t.co URLs, don't allow additional path characters.
        if (url.match(twttr.txt.regexen.validTcoUrl)) {
          url = RegExp.lastMatch;
          endPosition = startPosition + url.length;
        }
        urls.push({
          url: url,
          indices: [startPosition, endPosition]
        });
      }
    }

    return urls;
  };

  twttr.txt.modifyIndicesFromUTF16ToUnicode = function(text, entities) {
    twttr.txt.convertUnicodeIndices(text, entities, true);
  };

  twttr.txt.getUnicodeTextLength = function(text) {
    return text.replace(twttr.txt.regexen.non_bmp_code_pairs, ' ').length;
  };

  twttr.txt.convertUnicodeIndices = function(text, entities, indicesInUTF16) {
    if (entities.length == 0) {
      return;
    }

    var charIndex = 0;
    var codePointIndex = 0;

    // sort entities by start index
    entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });
    var entityIndex = 0;
    var entity = entities[0];

    while (charIndex < text.length) {
      if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
        var len = entity.indices[1] - entity.indices[0];
        entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
        entity.indices[1] = entity.indices[0] + len;

        entityIndex++;
        if (entityIndex == entities.length) {
          // no more entity
          break;
        }
        entity = entities[entityIndex];
      }

      var c = text.charCodeAt(charIndex);
      if (0xD800 <= c && c <= 0xDBFF && charIndex < text.length - 1) {
        // Found high surrogate char
        c = text.charCodeAt(charIndex + 1);
        if (0xDC00 <= c && c <= 0xDFFF) {
          // Found surrogate pair
          charIndex++;
        }
      }
      codePointIndex++;
      charIndex++;
    }
  };

  // Returns the length of Tweet text with consideration to t.co URL replacement
  // and chars outside the basic multilingual plane that use 2 UTF16 code points
  twttr.txt.getTweetLength = function(text, options) {
    if (!options) {
      options = {
          // These come from https://api.twitter.com/1.1/help/configuration.json
          // described by https://dev.twitter.com/rest/reference/get/help/configuration
          short_url_length: 23,
          short_url_length_https: 23
      };
    }
    var textLength = twttr.txt.getUnicodeTextLength(text),
        urlsWithIndices = twttr.txt.extractUrlsWithIndices(text);
    twttr.txt.modifyIndicesFromUTF16ToUnicode(text, urlsWithIndices);

    for (var i = 0; i < urlsWithIndices.length; i++) {
      // Subtract the length of the original URL
      textLength += urlsWithIndices[i].indices[0] - urlsWithIndices[i].indices[1];

      // Add 23 characters for URL starting with https://
      // http:// URLs still use https://t.co so they are 23 characters as well
      if (urlsWithIndices[i].url.toLowerCase().match(twttr.txt.regexen.urlHasHttps)) {
         textLength += options.short_url_length_https;
      } else {
        textLength += options.short_url_length;
      }
    }

    return textLength;
  };

  if (typeof module != 'undefined' && module.exports) {
    module.exports = twttr.txt;
  }

  if (typeof define == 'function' && define.amd) {
    define([], twttr.txt);
  }

  if (typeof window != 'undefined') {
    if (window.twttr) {
      for (var prop in twttr) {
        window.twttr[prop] = twttr[prop];
      }
    } else {
      window.twttr = twttr;
    }
  }
})();
