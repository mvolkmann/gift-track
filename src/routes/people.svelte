<script>
  const people = ['Tami', 'Amanda', 'RC', 'Jeremy', 'Meghan'];
  people.sort();
</script>

<section class="people">
  <h2>People</h2>
  {#each people as person}
    <button class="person">{person}</button>
  {/each}
</section>

<style>
  h2 {
    margin-top: 0;
  }

  .people {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;

    outline: 1px dashed red;
  }
</style>
