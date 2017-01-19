import 'scalejs.extensions'; // setup extensions before running main module
import 'app/modules';
import mainModule from './main/mainModule'; // always run main module after others

mainModule(); // start app