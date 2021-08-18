<script context="module" lang="ts">
  import type {ErrorLoadInput, LoadOutput} from '@sveltejs/kit/types';

  export function load({error}: ErrorLoadInput): LoadOutput {
    return {
      props: {message: error.message}
    };
  }
</script>

<script lang="ts">
  export let message: string;
</script>

<h2>{message}</h2>

<img alt="bad gift" src="/images/bad-gift.jpg" />

<style>
  img {
    object-fit: contain;
    width: 100%;
  }
</style>
