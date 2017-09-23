import knockoff from './../knockoffjs/knockoffjs';

knockoff
    .service('ThirdService', function (Injector) {
        let FirstService = Injector.get('FirstService');
        FirstService.sayHello();
    });
