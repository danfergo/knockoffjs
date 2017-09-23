import knockoff from '../providers.knockoff'


knockoff.ability('Eval', function () {

    function arrayUnique(array) {
        let a = array.concat();
        for (let i = 0; i < a.length; ++i) {
            for (let j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    }


    function getAllPropertyNames(obj) {
        let props = [];

        do {
            props = props.concat(Object.getOwnPropertyNames(obj));
        } while (obj = Object.getPrototypeOf(obj));

        return arrayUnique(props);
    }

    function getAllPropertyValues(obj, keys) {
        return keys.map(function (key) {
            return obj[key];
        });
    }

    function evalInContext(js, context) {
        let args = getAllPropertyNames(context);
        let values = getAllPropertyValues(context, args);
        try {
            let fn = eval('(function (' + args.join(',') + ') {return ' + js + ';})');
            let ret = fn.apply(null, values);
            return ret;
        }
        catch (err) {
            console.error('Evaluating:\n{{ ' + js + '}}\n\nScope:\n', context);
            throw err;
        }
    }


    return function (scope, element) {
        return function (js) {
            console.log(scope);
            return evalInContext(js, scope);
        }
    }
});


// knockoff.ability('Find', function () {
//     return function (scope, element) {
//         return function (js) {
//             console.log(scope);
//             return evalInContext(js, scope);
//         }
//     }
// });

knockoff.ability('On', function () {
    return function (scope, element) {
        return function (events, selector, callback) {
            return element.find(events, selector, callback);
        }
    }
});
