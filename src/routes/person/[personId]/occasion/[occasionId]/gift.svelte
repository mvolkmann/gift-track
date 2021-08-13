<script context="module">
  export async function load({page, fetch, session, context}) {
    const personId = Number(page.params.personId);
    const occasionId = Number(page.params.occasionId);

    let res = await fetch(`/api/person/${personId}`);
    const person = await res.json();

    res = await fetch(`/api/occasion/${occasionId}`);
    const occasion = await res.json();

    const url = `/api/person/${personId}/occasion/${occasionId}/gift`;
    res = await fetch(url);
    const gifts = await res.json();

    return {props: {person, occasion, gifts}};
  }
</script>

<script>
  export let gifts;
  export let occasion;
  export let person;
</script>

<h2>{occasion.name} Gifts for {person.name}</h2>

<ul>
  {#each gifts as gift}
    <li>{gift.name}</li>
  {/each}
</ul>
