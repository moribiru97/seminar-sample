(function(global){
    var seminorInfo = {};
    //初期化
    seminorInfo.init = function(options) {
        options |= {};
        var rankingTmpl = options.rankingTmpl || "<div class=\"${rank}\">${rank}位：${seminor.name}</div>";
        var themesTmpl = options.themesTmpl || "<div id=\"${theme.id}\" class=\"${theme.id}\"><h3>${theme.title}</h3></div>";
        var themeSeminorTmpl = options.themeSeminorTmpl || "<div class=\"${theme.id}_${seminor.id}\">${seminor.name}</div>";
        var calTmpl = options.calTmpl || "<span class=\"title\"><a href=\"${seminor.detail}\" id=\"pop${seminor.id}\">${seminor.name}</a></span>";
        var calTipTmpl = options.calTipTmpl || "<span>${seminor.name}<br>日時：${seminor.date}<br>開催会社：${seminor.corp}<br>最寄駅：${seminor.nearSta";

        console.log("call init");
        //全seminor情報とランキング、テーマ別用のjsonをセットする
        $.getJSON("data/seminors.json", function(data) {
            seminorInfo.ranking = data.ranking; 
            seminorInfo.themes  = data.themes;
            var _seminors = {};
            $.each(data.seminors, function(i,seminor) {
                //dateをparseして詰め直す
                var d_ary = seminor.date.split("/");
                seminor.date = new Date(parseInt(d_ary[0]),parseInt(d_ary[1]),parseInt(d_ary[2]));
                _seminors[seminor.id] = seminor;
            });
            seminorInfo.seminors = _seminors; 
            console.log("done init");
            //initが終わり次第各種表示を呼び出す
            seminorInfo.showRanking(rankingTmpl);
            seminorInfo.showThemes(themesTmpl, themeSeminorTmpl);
            seminorInfo.showCalender(calTmpl, calTipTmpl);
        });
    };

    //ランキング表示
    seminorInfo.showRanking = function(template) {
        $.each(seminorInfo.ranking, function(index, rankSeminorId){
            //jsonのrankingで設定したseminorのidを使ってseminorを取得
            var seminor = seminorInfo.seminors[rankSeminorId];
            //それっぽいところにappend.indexは0からなので+1すると順位
            var rank = index + 1;
            $.tmpl(template,{
                rank: rank,
                seminor: seminor
            }).appendTo("#ranking");
        });
    };

    //テーマ別表示
    seminorInfo.showThemes = function(themesTmpl, themeSeminorTmpl) {
        //全テーマを持って来てroop
        $.each(seminorInfo.themes, function(index, theme){
            var themesEl = $("#themes");
            $.tmpl(themesTmpl, {
                theme: theme
            }).appendTo(themesEl);
            $.each(theme.seminors, function(index, themeSeminorId){
                var seminor = seminorInfo.seminors[themeSeminorId];
                //各テーマのdivに当該セミナーをappend
                $.tmpl(themeSeminorTmpl,{
                    theme: theme,
                    seminor: seminor
                }).appendTo(themesEl.children("div#" + theme.id));
            });
        });
    };

    seminorInfo.showCalender = function(calTmpl, calTipTmpl) {
        console.log("call showCal");
        //全セミナーをループで回す
        $.each(seminorInfo.seminors, function(index,seminor){
            //seminorのdateを使って、あらかじめidを振っておいたcalendarのtdを取得し、そこにappend
            //pop用のidも振っておく
            $.tmpl(calTmpl, {
               seminor: seminor
            }).appendTo($("#day_" + seminor.date.getDate()));
            //tooltip（既存サイトにあったので。）
            $('#pop' + seminor.id).tooltipster({
                content: $.tmpl(calTipTmpl, {
                    seminor: seminor
                })
            });
        });
    };
    global.seminorInfo = seminorInfo;
})(window);
