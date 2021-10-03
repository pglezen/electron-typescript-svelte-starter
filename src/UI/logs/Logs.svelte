<script lang="ts">
  import { onDestroy } from 'svelte';
  import { DateTime } from 'luxon';
  import { logRecords } from './logStore';
  import type { LogRecord } from '../../logs';

  let allRecords: LogRecord[] = [];
  let msgFilter: string = '';
  let msgExpr: RegExp | undefined;

  $: msgExpr = msgFilter.length > 0 ? new RegExp(msgFilter, 'i') : undefined;

  let unsubscribe = logRecords.subscribe(value => {
    allRecords = value;
    console.log(`Total log records = ${allRecords.length}`);
  });

  const setClassName = (r: LogRecord, filter: RegExp): string => {
    let className = '';
    if (r.error) {
      className = 'error';
    } else {
      if (msgExpr?.test(r.message)) {
        className = 'match';
      }
    }
    return className;
  }

  onDestroy(() => {
    unsubscribe ?? unsubscribe();
  })

  const exportLog = () => {
    window.log.exportLogs();
  }
</script>

<header>
  <label >
    Search
    <input type="text" bind:value={msgFilter}>
    (Regular Expression)
  </label>
  <button on:click={window.log.exportLogs}>Export</button>

</header>
<main>
  {#each allRecords as r (r.timestamp)}
    <p class={setClassName(r, msgExpr)}>
      {DateTime.fromISO(r.timestamp).toFormat('LL-dd HH:mm:ss.SSS')}: {r.message}
    </p>
  {/each}
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  main {
    width: 100%;
    height: 90%;
    overflow-y: scroll;
    background: #494949;
    color: #e0c465;
  }

  label {
    color: ivory;
  }

  p {
    margin-block-start: 0;
    margin-block-end: 0;
    font-family: consolas,monospace;
    font-size: 10pt;
  }

  p.match {
    color: #e3fd50;
  }
</style>