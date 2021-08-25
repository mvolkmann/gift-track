<script lang="ts">
  import {page} from '$app/stores';
  import Toast from '$lib/Toast.svelte';
  import '../app.css';

  type Link = {href: string; name: string};

  const links: Link[] = [
    {href: '/', name: 'About'},
    {href: '/people', name: 'People'},
    {href: '/occasions', name: 'Occasions'},
    {href: '/gifts', name: 'Gifts'}
  ];
</script>

<svelte:head>
  <title>Gift Track</title>
</svelte:head>

<main>
  <h1>Gift Track</h1>
  <nav>
    {#each links as link}
      <a href={link.href} class:active={link.href === $page.path}>{link.name}</a
      >
    {/each}
  </nav>
  <section class="slot">
    <slot />
  </section>
  <Toast />
</main>

<style>
  a {
    text-decoration: none;
  }

  a.active {
    border-bottom: 3px solid var(--secondary-color);
  }

  h1 {
    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  main {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 1rem); /* for top padding */
  }

  main > * {
    width: 100%;
  }

  nav {
    display: flex;
    gap: 1rem;
  }

  .slot {
    flex-grow: 1;
    margin-top: 1rem;
    overflow-y: scroll;
  }
</style>
