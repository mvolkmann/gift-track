<script lang="ts">
  import {browser} from '$app/env';
  import {errorStore} from '$lib/stores';

  let message = '';

  if (browser) {
    let msg = $errorStore;
    if (msg) {
      const PREFIX = 'Error: ';
      if (msg.startsWith(PREFIX)) msg = msg.substring(PREFIX.length);
      message = msg;
    }
  }
</script>

<div class="error">{message}</div>

<img alt="bad gift" src="/images/bad-gift.jpg" />

<style>
  .error {
    color: red;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  img {
    object-fit: contain;
    width: 100%;
  }
</style>
