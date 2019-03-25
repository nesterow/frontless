import * as riot from 'riot';
import RiotWaiter from './waiter';
import RiotFrontLess from './frontless';

riot.mixin(RiotWaiter);
riot.mixin(RiotFrontLess);


export default riot;
