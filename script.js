$(function() {
    echo = function($1) {
        $('#echo').append((typeof $1 === 'boolean' ? $1.toString() : $1));
    };
    trim = function($1) {
        if (typeof $1 === 'object') {
            $.each($1, function(k, v) {
                $1[k] = $.trim(v);
            });
        }
        if (typeof $1 === 'string') $1 = $.trim($1);

        return $1;
    };
    $css = $('style').html();
    $patterns = {
        comment: /\/\*([^\*\/]*)\*\//g,
        block: /\{([^\}]*)\}/g,
        attribute: /\[([^\]]*)\]/g,
        combinator: /[>\+~]\s+[\S+]/,
        badwhitespace: /(\s\s|\n)/g
    };

    //remove comments
    $cleanCss = $css.replace($patterns.comment, '');

    $rules = $cleanCss.match($patterns.block);
    $.each($rules, function(k, v) {
        if (v) {
            //remove '{' '}'
            var $arr1 = v.substr(1, v.length - 2).split(';');

            var $obj1 = [];
            $.each($arr1, function(k1, v1) {
                var $arr2 = v1.split(':');
                $obj1.push({
                    rule: trim($arr2[0]),
                    value: trim($arr2[1])
                });
            });
            //remove last arr item (which is always empty)
            $obj1.splice($obj1.length - 1, 1);
            $rules[k] = $obj1;
        }
    });
    $selectors = $cleanCss.replace($patterns.block, '@block@').split('@block@');
    $.each($selectors, function(k, v) {
        console.log(v.replace($patterns.badwhitespace, ''));
        $selectors[k] = trim(v.replace($patterns.badwhitespace, ''));
    });
    console.log($selectors);
    //remove last arr item (which is always empty)
    $selectors.splice($selectors.length - 1, 1);

    cssTree = [];
    $.each($rules, function(k, v) {
        cssTree.push({
            selector: $selectors[k],
            rules: v
        });
    });
    console.log(cssTree);
    nodeTree = [];
    $.each(cssTree, function(k, v) {
        if (v) {
            var $attrSel = v.selector.match($patterns.attribute);
            if ($attrSel && $attrSel.length) {
                $.each($attrSel, function(k1, v1){
                    cssTree[k].selector = v.selector.replace(v1,'@attr-'+k1+'@');
                });
                console.log(cssTree[k], $attrSel);
            }
            while (v.selector.match($patterns.combinator)) {
                var $combSel = v.selector.match($patterns.combinator);
                cssTree[k].selector = v.selector.replace($combSel[0], $combSel[0].replace(/\s/g,''));
            }
            
            $arr = trim(v.selector.split(','));
            console.log($arr);
            $.each($arr, function(k1, v1){
                $tree = v1.replace(/\s+/g, ' ').split(' ');
                console.log($tree);
            });
            
        }
    });
});