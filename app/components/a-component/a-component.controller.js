import knockoff from './../../knockoffjs/knockoffjs';
console.log(document.location.pathname);

knockoff
    .component('a-component', {
        templateUrl: 'components/a-component/a-component.html',
        controller: function () {

            // this.On('click', 'p', function () {
            //     console.log('xpto');
            // });

            this.lindo = "<b> HTML  </b>";
            this.counter = 0;
            this.items = [{
                name: 'John Doe',
                age: 23
            }, {
                name: 'John Doe',
                age: 23
            },

            ];

            var ctrl = this;
            setInterval(function () {

                ctrl.items.push({
                    name: 'Johnyy',
                    age: 23
                });
                ctrl.counter++;
                ctrl.render();

            }, 1000);


        }
    });