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

  $: pageName = links.find(link => link.href === $page.path).name;

  function isActive(link: Link) {
    console.log('__layout.svelte isActive: link =', link);
    return link.href === $page.path;
  }
</script>

<svelte:head>
  <title>Gift Track - {pageName}</title>
</svelte:head>

<h1>Gift Track</h1>
<nav>
  {#each links as link}
    <a href={link.href} class:active={link.href === $page.path}>{link.name}</a>
  {/each}
</nav>

<slot />

<Toast />

<style>
  a {
    color: white;
    text-decoration: none;
  }

  a.active {
    border-bottom: 3px solid var(--secondary-color);
  }

  h1 {
    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  nav {
    display: flex;
    gap: 1rem;
  }
</style>
