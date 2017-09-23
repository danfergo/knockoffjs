let object = {};
Object.setPrototypeOf(object, null);
console.dir(object);

$.fn.textNodes = function () {
    return this.filter(function () {
        return this.nodeType === 3; //Node.TEXT_NODE
    });
};

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

export function evalInContext(js, context) {
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

    // console.dir(context);
    // console.log();
    // ;

    // console.log(ret);
}

// let createScope = function (properties, parent) {
//     if (!properties) {
//         properties = {};
//     }
//     // properties.__proto__ = parent || null;
//     Object.setPrototypeOf(properties, null);
//     return properties;
// };
//

// function parseAs(str) {
//     return str.split(' as ').map(function (term) {
//         return term.trim();
//     })
// }

function renderText(template, scope) {

//  \{\{\s*([\$\w]*([.][\$\w]+)*(\([\w]*,?[\w]*\))?)\s*

    template = template.replace(/\{\{([:"&;,-^'\s()?|\w$[\].{},+]*)\}\}/gi, function (_, expression) {
        return evalInContext(expression, scope);
    });


    return template;
}

export function buildTree($elem) {
    var tree = [];
    $elem.contents().each(function () {
        var $child = $(this);
        tree.push({
            children: buildTree($child),
            element: $child
        });
    });
    return tree;
}


function renderElement(element, scope, transforms) {

    for (let t in transforms) {
        let val = element.attr(t);
        if (val) {
            let reps = transforms[t](scope, element, val);
            reps.elements = $(reps.elements);
            return reps;
        }
    }
    return {
        elements: element.clone().empty(),
        scopes: [scope]
    };
}
// console.log(reps.elements);
// console.log(transforms);
// console.log(val);

// console.log(elems);
// var reps = parseAs(val);

// var reps = {
//     elements: [],
//     scopes: []
// };
//
// var object = eval('scope.' + terms[0]);
// for (var p in object) {
//
//     var newScope = createScope({}, scope);
//     newScope[terms[1]] = object[p];
//     if ($.isArray(object)) {
//         newScope['$first'] = p == 0;
//         newScope['$last'] = p == (object.length - 1);
//     }
//     newScope['$index'] = p;
//
//     reps.elements.push(element.clone().empty().get(0));
//     reps.scopes.push(newScope);
// }


// var foreach = element.attr('foreach');
// if (foreach) {
//     var terms = parseAs(foreach);
//
//     var reps = {
//         elements: [],
//         scopes: []
//     };
//
//     var object = eval('scope.' + terms[0]);
//     for (var p in object) {
//
//         var newScope = createScope({}, scope);
//         newScope[terms[1]] = object[p];
//         if ($.isArray(object)) {
//             newScope['$first'] = p == 0;
//             newScope['$last'] = p == (object.length - 1);
//         }
//         newScope['$index'] = p;
//
//         reps.elements.push(element.clone().empty().get(0));
//         reps.scopes.push(newScope);
//     }
//
//     reps.elements = $(reps.elements);
//     return reps;
// }

// var if_ = element.attr('if');
// if (if_) {
//     let exp = evalInContext(if_, scope);
//     return {
//         elements: exp ? element.clone().empty() : $([]),
//         scopes: exp ? [scope] : []
//     };
// }


// }


export function renderTree(node, ctrl, transforms) {
    if (node.element.textNodes().length > 0) {
        return renderText(node.element.text(), ctrl);
    }

    let rendered = renderElement(node.element, ctrl, transforms);

    rendered.elements.each(function (i) {
        var renderedElement = $(this);

        node.children.forEach(function (child) {
            var childElements = renderTree(child, rendered.scopes[i], transforms);
            if (childElements) {
                renderedElement.append(childElements);
            }
        });
    });

    return rendered.elements;
}

