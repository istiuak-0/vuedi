import { Provide, type OnMounted, type OnUnmounted } from 'iocraft';

@Provide()
export class CountService implements OnMounted, OnUnmounted {
  onMounted(): void {
    console.log('On Mounted Hook Runned inside service');
  }

  onUnmounted(): void {
    console.log('On UnMounted Hook Runned inside service');
  }
}
