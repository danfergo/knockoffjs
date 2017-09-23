import knockoff from './../knockoffjs/knockoffjs';

knockoff
    .service('SecondService', function (FirstService) {
        FirstService.sayHello();
    });
