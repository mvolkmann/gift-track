<script context="module">
  export async function load({page, fetch, session, context}) {
    const url = '/api/occasion';
    const res = await fetch(url);
    const occasions = await res.json();
    return {props: {occasions}};
  }
</script>

<script>
  export let occasions;
</script>

<h2>Occasions</h2>

<ul>
  {#each occasions as occasion}
    <li>{occasion.name}</li>
  {/each}
</ul>
