import { assert } from '../utils';

export type Status = 'stopped' | 'paused' | 'running' | 'finished';

export class Timer {
  private state:
    | { value: 'stopped'; remaining: number }
    | {
        value: 'paused';
        remaining: number;
        callback: () => void;
      }
    | {
        value: 'running';
        remaining: number;
        callback: () => void;
        start: number;
        timeout?: unknown;
      }
    | { value: 'finished' };

  /**
   * If `ms` is smaller or equal to zero (including -Infinity), the callback is added to the event loop and executed async immediately
   * If `ms` is +Infinity the timer never finishes.
   * @throws {@link TypeError}. If `ms` is NaN
   * @param ms The number of milliseconds before the callback is called after started.
   */
  constructor(ms: number) {
    assert(
      !Number.isNaN(ms),
      new TypeError("Can't start a timer with NaN time"),
    );
    this.state = { value: 'stopped', remaining: ms };
  }

  get status(): Status {
    return this.state.value;
  }

  /**
   * @throws {@link Error}. If it wasn't running or paused
   */
  cancel() {
    assert(
      this.status === 'paused' || this.status === 'running',
      new Error('Tried to cancel a not running Timer'),
    );
    this.onFinish(false);
  }

  /**
   * @throws {@link Error}. If it wasn't running
   */
  pause() {
    assert(
      this.state.value === 'running',
      new Error('Tried to pause a not running Timer'),
    );

    const { callback, start, timeout, remaining } = this.state;

    timeout !== undefined && clearTimeout(timeout as any);
    this.state = {
      value: 'paused',
      callback,
      remaining: remaining - (Date.now() - start),
    };
  }

  /**
   * @throws {@link Error}. If it was already started
   */
  start(callback: () => void) {
    assert(
      this.state.value === 'stopped',
      new Error('Tried to start an already running Timer'),
    );

    const { remaining } = this.state;
    this.state = { value: 'paused', remaining, callback };
    this.resume();
  }

  /**
   * @throws {@link Error}. If it wasn't paused
   */
  resume() {
    assert(
      this.state.value === 'paused',
      new Error('Tried to resume not paused Timer'),
    );
    const { remaining, callback } = this.state;
    const start = Date.now();

    let timeout: unknown = undefined;
    // setTimeout returns immediately on +Infinity which we use
    if (remaining !== Number.POSITIVE_INFINITY) {
      timeout = setTimeout(() => this.onFinish(true), remaining);
    }

    this.state = { value: 'running', callback, remaining, start, timeout };
  }

  private onFinish(shouldCall: boolean) {
    assert(this.state.value === 'running' || this.state.value === 'paused');

    if (this.state.value === 'running' && this.state.timeout !== undefined) {
      clearTimeout(this.state.timeout as any);
    }

    const { callback } = this.state;
    this.state = { value: 'finished' };

    if (shouldCall) {
      callback();
    }
  }
}
