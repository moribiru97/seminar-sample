(function(global){
    var seminorInfo = {};
    //初期化
    seminorInfo.init = function() {
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
            seminorInfo.showRanking();
            seminorInfo.showThemes();
            seminorInfo.showCalender();
        });
    };

    //ランキング表示
    seminorInfo.showRanking = function() {
        $.each(seminorInfo.ranking, function(index, rankSeminorId){
            //jsonのrankingで設定したseminorのidを使ってseminorを取得
            var rankSeminor = seminorInfo.seminors[rankSeminorId];
            //それっぽいところにappend.indexは0からなので+1すると順位
            var rank = index + 1;
            $("#ranking").append("<div class=\"\"" + rank + ">" + rank + "位：" + rankSeminor.name + "</div>");
        });
    };

    //テーマ別表示
    seminorInfo.showThemes = function() {
        //全テーマを持って来てroop
        var themesEl = $("#themes");
        $.each(seminorInfo.themes, function(index, theme){
            themesEl.append("<div id=\"" + theme.id + "\" class=\"" + theme.id + "\"><h3>" + theme.title + "</h3></div>");
            $.each(theme.seminors, function(index, themeSeminorId){
                var themeSeminor = seminorInfo.seminors[themeSeminorId];
                //各テーマのdivに当該セミナーをappend
                var tEl = themesEl.children("div#" + theme.id);
                tEl.append("<div class=\"\"" + theme.id + "_" + themeSeminorId + ">" + themeSeminor.name + "</div>");
            });
        });
    };

    seminorInfo.showCalender = function() {
        console.log("call showCal");
        //全セミナーをループで回す
        $.each(seminorInfo.seminors, function(index,seminor){
            //seminorのdateを使って、あらかじめidを振っておいたcalendarのtdを取得し、そこにappend
            //pop用のidも振っておく
           $("#day_" + seminor.date.getDate()).append("<span class=\"title\"><a href=\"" + seminor.detail + "\" id=\"pop" + seminor.id + "\">" + seminor.name + "</a></span>"); 
            //tooltip（既存サイトにあったので。）
            $('#pop' + seminor.id).tooltipster({
                content: $('<span>' + seminor.name + '<br>日時：' + seminor.date + '<br>開催会社：' + seminor.corp + '<br>最寄駅：' + seminor.nearSta)
            });
        });
    };
    global.seminorInfo = seminorInfo;
})(window);
