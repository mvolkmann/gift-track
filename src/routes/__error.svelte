<script context="module" lang="ts">
  import type {ErrorLoadInput, LoadOutput} from '@sveltejs/kit/types';

  export function load({error}: ErrorLoadInput): LoadOutput {
    return {
      props: {message: error.message}
    };
  }
</script>

<script lang="ts">
  import {browser} from '$app/env';
  import {goToErrorPage} from '$lib/util';

  export let message: string;

  if (browser) goToErrorPage(new Error(message));
</script>

<!-- This isn't expected to ever happen. -->
<p>This page was rendered on the server and cannot access an error message.</p>
