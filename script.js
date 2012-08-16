$(function() {
    echo = function($1) {
        $('#echo').append((typeof $1 === 'boolean' ? $1.toString() : $1));
    };
    trim = function($1) {
        if (typeof $1 === 'object') {
            $.each($1, function(k, v){
                $1[k] = $.trim(v);
            });
        }
        if (typeof $1 === 'string')
            $1 = $.trim($1);
        
        return $1;
    };
    $html = $('style').html();
    $commentPat = /\/\*([^\*\/]*)\*\//g;
    $blockPat = /\{([^\}]*)\}/g
    
    //remove comments
    $cleancode = $html.replace($commentPat, ''); 
    
    $rules = $cleancode.match($blockPat);
    $.each($rules, function(k, v){
        //remove '{' '}'
        var $arr1 = v.substr(1,v.length-2).split(';');
        
        var $obj1 = [];
        $.each($arr1, function(k1, v1){
            var $arr2 = v1.split(':');
            $obj1.push({
                rule: trim($arr2[0]),
                value: trim($arr2[1])
            });
        });
        //remove last arr item (which is always empty)
        $obj1.splice($obj1.length-1,1);
       $rules[k] = $obj1;
    });
    $selectors = $cleancode.replace($blockPat, '@block@').split('@block@');
    $.each($selectors, function(k, v){
       $selectors[k] = trim(v).replace('\n', ' ');
    });
    //remove last arr item (which is always empty)
    $selectors.splice($selectors.length-1,1);
    
    cssTree = [];
    $.each($rules, function(k, v){
        cssTree.push({ selector: $selectors[k], rules: v });
    });
    console.log(cssTree);
    nodeTree = [];
    $.each(cssTree, function(k, v){
        $arr = v.selector.split(',');
        console.log(trim($arr));
        /*$.each($arr, function(k1, v1){
            if (v1 === undefined || !$.trim(v1).length)
                $arr.splice(k1,1);
        });*/
    });
});​