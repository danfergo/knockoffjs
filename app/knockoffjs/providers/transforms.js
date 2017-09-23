
import knockoff from '../providers.knockoff'

function parseAs(str) {
    return str.split(' as ').map(function (term) {
        return term.trim();
    })
}


// knockoff.transform('controller', function(){
//
// });

knockoff.transform('if', function(){
    return function(scope, element, attr){
        let exp = scope.Eval(attr);
        return {
            elements: exp ? element.clone().empty() : $([]),
            scopes: exp ? [scope] : []
        };
    }
});


knockoff.transform('foreach', function(){
    return function(scope, element, attr){

        let reps = {
            elements: [],
            scopes: []
        };

        let terms = parseAs(attr);
        let object = scope.Eval(terms[0]);
        for (let p in object) {

            let newScope = scope.New();
            newScope[terms[1]] = object[p];

            if ($.isArray(object)) {
                newScope['$first'] = p == 0;
                newScope['$last'] = p == (object.length - 1);
            }

            newScope['$index'] = p;

            reps.elements.push(element.clone().empty().get(0));
            reps.scopes.push(newScope);
        }
        // console.log(reps);
        return reps;
    }
});