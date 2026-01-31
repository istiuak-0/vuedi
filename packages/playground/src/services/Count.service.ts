import { Provide } from 'iocraft';
import { Store } from 'iocraft/helpers';
import { watch } from 'vue';


@Provide()
export class CountStore extends Store({
  data: 10,
  name: 'Istiuak',
}) {
  unwatch = watch(this.select('data'), () => {



console.log();



  });
}
