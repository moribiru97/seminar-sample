(function(global){
    var seminorInfo = {};
    //初期化
    seminorInfo.init = function(cb) {
        if (!cb ) {
            throw "init callback is undifined";
        }
        var _cb = cb;
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
            //initが終わり次第callbackを呼び出す
            cb();
        });
    };

    //ランキング表示
    seminorInfo.showRanking = function(params) {
        var elmId = params.elmId;
        var rankingTmpl = params.rankingTmpl;
        $.each(seminorInfo.ranking, function(index, rankSeminorId){
            //jsonのrankingで設定したseminorのidを使ってseminorを取得
            var seminor = seminorInfo.seminors[rankSeminorId];
            //それっぽいところにappend.indexは0からなので+1すると順位
            var rank = index + 1;
            $.tmpl(rankingTmpl,{
                rank: rank,
                seminor: seminor
            }).appendTo("#" + elmId);
        });
    };

    //テーマ別表示
    seminorInfo.showThemes = function(params) {
        var elmId = params.elmId;
        var themeElmId = params.themeElmId;
        var themesTmpl = params.themesTmpl;
        var themeSeminorTmpl = params.themeSeminorTmpl;
        //全テーマを持って来てroop
        $.each(seminorInfo.themes, function(index, theme){
            var themesEl = $("#" + elmId);
            $.tmpl(themesTmpl, {
                theme: theme
            }).appendTo(themesEl);
            $.each(theme.seminors, function(index, themeSeminorId){
                var seminor = seminorInfo.seminors[themeSeminorId];
                //各テーマのdivに当該セミナーをappend
                $.tmpl(themeSeminorTmpl,{
                    theme: theme,
                    seminor: seminor
                }).appendTo("#" + $.tmpl(themeElmId, {
                    theme: theme,
                }).text());
            });
        });
    };

    seminorInfo.showCalender = function(params) {
        var elmIdPrefix = params.elmIdPrefix;
        var calTipElmId = params.calTipElmId;
        var calTmpl = params.calTmpl;
        var calTipTmpl = params.calTipTmpl;
        //全セミナーをループで回す
        $.each(seminorInfo.seminors, function(index,seminor){
            //seminorのdateを使って、あらかじめidを振っておいたcalendarのtdを取得し、そこにappend
            //pop用のidも振っておく
            $.tmpl(calTmpl, {
               seminor: seminor
            }).appendTo($("#" + elmIdPrefix + seminor.date.getDate()));
            //tooltip（既存サイトにあったので。）

            var ctId = $.tmpl(calTipElmId, {
                seminor : seminor
            }).text();
            $("#" + ctId).tooltipster({
                content: $.tmpl(calTipTmpl, {
                    seminor: seminor
                })
            });
        });
    };
    global.seminorInfo = seminorInfo;
})(window);
