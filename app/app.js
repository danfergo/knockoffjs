import '!style-loader!css-loader!./style.css';
import 'jquery';

import 'bootstrap';


import './components/a-component/a-component.controller'
import './components/b-component/b-component.controller'

import './services/first-service.service'
import './services/second-service.service'
import './services/third-service.service'


import knockoff from './knockoffjs/knockoffjs';

knockoff.run();

