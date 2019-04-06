module.exports = function levenshteinDistance(s,t){
    if(m==0&&n==0) {
        return 0;
    }
    if(s.length > t.length){
        var temp = s;
        s = t;
        t = temp;
        delete temp;
    }
    var n = s.length;
    var m = t.length;
    if(m == 0){
        return n;
    } else if(n == 0) {
        return m;
    }
    var v0=[];
    for(var i = 0;i <= m;i ++){
        v0[i] = i;
    }
    var v1 = new Array(n+1);
    var cost = 0;
    for(var i = 1;i <= n;i ++){
        if(i > 1){
            v0 = v1.slice(0);
        }
        v1[0] = i;
        for(var j=1; j<=m; j++){
            if(s[i-1].toLowerCase()==t[j-1].toLowerCase()){
                cost=0;
            }
            else{
                cost=1;
            }
            v1[j]=Math.min.call(null,v1[j-1]+1,v0[j]+1,v0[j-1]+cost);
        }
    }
    return v1.pop()/m;
}

