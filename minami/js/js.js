$(document).ready(function () {
    $.getJSON("js/data.json", function(data){
        for(var i in data){
        $("#output").append("<li><strong>" + data[i].month + "月のセミナー</strong></li>");
            for(var j in data[i].seminer){
                $("#output").append("<li>" + data[i].seminer[j].title + "（"+ data[i].month + "月 "+ data[i].seminer[j].date + "日）</li>");
            }
        }
    });
});