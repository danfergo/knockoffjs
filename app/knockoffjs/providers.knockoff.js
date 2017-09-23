import {renderTree, buildTree, evalInContext} from './render.knockoffjs'


let declarations = {
    services: {},
    components: {},
    transforms: {},
    abilities: {},
};

let providers = {
    services: {},
    components: {},
    transforms: {},
    abilities: {},
};

let rootScope = {};

function instantiateDependencies(name, type) {
    let dependencies = [];
    declarations[type][name].dependencies.forEach(function (dependency) {
        if (!(dependency in declarations['services'])) {
            throw 'Knockout: Dependency «' + dependency + '» requested by «' + name + '», was not declared.';
        }
        else if (providers['services'][dependency] === true) {
            throw 'Knockout: Circular dependencies detected between «'
            + name + '» and «' + dependency + '».';
        } else {
            dependencies.push(instantiateProvider(dependency, 'services'));
        }
    });
    return dependencies;
}

function instantiateProvider(name, type, prt, singleton = true) {
    if (singleton && providers[type][name]) {
        return providers[type][name];
    }

    providers[name] = true;
    let dependencies = instantiateDependencies(name, type);
    let serviceFn = declarations[type][name].fn;

    let provider = prt || Object.create(serviceFn.prototype);
    serviceFn.apply(provider, dependencies);

    return providers[type][name] = provider;
}


function instantiateTransform(name) {
    let type = 'transforms';
    if (providers[type][name]) {
        return providers[type][name];
    }
    let dependencies = instantiateDependencies(name, type);
    let serviceFn = declarations[type][name].fn;
    return providers[type][name] = serviceFn.apply(serviceFn, dependencies);

    // providers[name] = true;

    // let provider = prt || Object.create(serviceFn.prototype);
    // ;
}


function instantiateProviders(type) {
    for (let name in declarations[type]) {
        instantiateProvider(name, type);
    }
}

function parseDependencies(declaration) {
    let fnArgsRegex = /\(\s*((?:\w+)?|(?:\w+)(?:\s*,\s*\w+)*)\s*\)/i
    let fnStr = declaration.toString();
    let fnArgs = fnStr.match(fnArgsRegex)[1];

    let dependencies = fnArgs.length > 0 ? fnArgs.split(',').map(function (arg) {
        return arg.trim();
    }) : [];

    return dependencies;
}

let knockoff = {
    Scope: function(proto){
        Object.setPrototypeOf(this, proto || null);
    },
    service: function (name, declaration) {
        if (name in declarations['services']) {
            throw 'Knockout: Service «' + name + '» already exists.';
        }

        declarations['services'][name] = {
            fn: declaration,
            dependencies: parseDependencies(declaration)
        };

        return knockoff;
    },
    component: function (name, declaration) {
        if (name in declarations['components']) {
            throw 'Knockout: Component «' + name + '» already exists.';
        }


        declarations['components'][name] = {
            fn: declaration.controller,
            dependencies: parseDependencies(declaration.controller),
            templateUrl: declaration.templateUrl
        };
    },
    transform: function (name, declaration) {
        if (name in declarations['transforms']) {
            throw 'Knockout: Transform «' + name + '» already exists.';
        }

        declarations['transforms'][name] = {
            fn: declaration,
            dependencies: parseDependencies(declaration)
        }
    },
    ability: function (name, declaration) {
        if (name in declarations['abilities']) {
            throw 'Knockout: Ability «' + name + '» already exists.';
        }

        declarations['abilities'][name] = {
            fn: declaration,
            dependencies: parseDependencies(declaration)
        }
    },
    run: function () {

        knockoff.service('Injector', function () {
            this.get = function (name) {
                if (!(name in providers['services'])) {
                    throw 'Knockout: Service «' + name + '» was not declared.';
                }
                return providers['services'][name];
            };
        });

        Object.setPrototypeOf(rootScope, null);


        $(function () {
            instantiateProviders('services');

            for (let transform in declarations['transforms']) {
                // console.log(transform);
                instantiateTransform(transform);
            }

            for (let ability in declarations['abilities']) {
                let dependencies = instantiateDependencies(ability, 'abilities');
                let abilityFn = declarations['abilities'][ability].fn;

                providers['abilities'][ability] = abilityFn.apply(null, dependencies);
            }




            for (let component in declarations['components']) {

                $.get(declarations['components'][component].templateUrl, {}, function (html) {
                    console.log(html);

                    $(component).each(function () {


                        let $elem = $(this);
                        $elem.append(html);
                        // var ctrlArgs = parseAs($elem.attr('controller'));
                        // var ctrlName = ctrlArgs[0];

                        // var ctrlAlias = ctrlArgs.length > 1 ? ctrlArgs[1] : false;

                        var tree = {
                            element: $elem,
                            children: buildTree($elem)
                        };

                        // var ctrl = new(window[ctrlName])();
                        let rootScopeParent = new (function () {
                            this.find = function (selector) {
                                return $elem.find(selector);
                            };

                            // this.on = functScopeion (selector, actions, callback) {
                            //     $elem.on(actions, selector, callback);
                            // };

                            this.render = function () {
                                var rendered = renderTree(tree, rootScope, providers['transforms']);
                                $elem.html(rendered.html());
                            };

                            this.New = function () {
                                let scope = {};
                                Object.setPrototypeOf(scope, this);
                                return scope;
                            };

                            this.Eval = function (js) {
                                console.log(this);
                                return evalInContext(js, this);
                            };



                            // abilityFn.apply(null, dependencies)(rootScopeParent, $elem);
                        });

                        for (let ability in providers['abilities']) {

                            rootScopeParent[ability] = providers['abilities'][ability](rootScopeParent, $elem);
                            console.log(ability);
                        }

                        Object.setPrototypeOf(rootScopeParent, null);

                        let rootScope = instantiateProvider(component, 'components', new (knockoff.Scope()), false);


                        rootScope.render();
                    });


                });
            }
        });


        console.log('.end.');
    }
};

export default knockoff;