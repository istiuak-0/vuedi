import { Register, type UnMounted } from '@vuedi/core';
import { ref } from 'vue';

@Register({
  in: 'root',
})
export class AppService implements UnMounted {
  onUnmounted(): void {}

  data = ref('dafd');
}
