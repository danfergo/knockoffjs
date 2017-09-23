import knockoff from './../knockoffjs/knockoffjs';

knockoff
    .service('FirstService', function () {
        this.sayHello = function () {
            console.log('FirstService says hello.');
        }
    });