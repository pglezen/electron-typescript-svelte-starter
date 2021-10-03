<script lang="ts">
	import {  dbname } from '../my-store';

</script>

<header>
	<h1>A New Application</h1>
</header>

<main>
	{#if $dbname}
	<div id="stats">
		<p>Database: {$dbname}</p>
	</div>
	{:else}
	  <img src="img/ferenc-almasi-eYpcLDXHVb0-unsplash.jpg" alt="placeholder">
	{/if}

</main>

<style>
	header {
		text-align: center;
		margin: 10px auto;
	}

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	main > img {
		width: 70%;
	}

	h1 {
		color: #886153;
		font-weight: 100;
		vertical-align: top;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>