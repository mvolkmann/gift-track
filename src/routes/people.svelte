<script context="module">
  export async function load({page, fetch, session, context}) {
    const url = '/api/person';
    const res = await fetch(url);
    const people = await res.json();
    return {props: {people}};
  }
</script>

<script>
  export let people;
</script>

<h2>People</h2>

<ul>
  {#each people as person}
    <li>{person.name}</li>
  {/each}
</ul>
