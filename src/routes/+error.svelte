<script lang="ts">
	import { page } from '$app/stores';

	let errorCode: number = $page.status;
</script>

<svelte:head>
	{#if errorCode === 404}
		<title>Got lost?</title>
	{:else}
		<title>Oops, something happened here</title>
	{/if}
</svelte:head>
<div class="content">
	{#if errorCode === 404}
		<h1>Oops!</h1>
		<p>
			Looks like the page you requested does not exist. While you find what
			you're searching for, try getting to know me better on one of the pages
			from the top right.
		</p>
	{:else}
		<h1>An error ocurred</h1>
		<p>
			Something really unexpected happened. I'm working to fix it as soon as
			possible. Thanks for your patience!
		</p>
	{/if}
</div>

<style lang="scss">
	.content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		height: 100%;
		flex: 1;

		h1 {
			font-family: 'Caudex', serif;
			color: #eee5e9;
			font-size: 4rem;
			margin-bottom: 26px;

			@media screen and (max-width: 1024px) {
				font-size: 3rem;
				margin-bottom: 18px;
			}

			@media screen and (max-width: 600px) {
				font-size: 2.5rem;
			}
		}

		p {
			font-family: 'Onest', sans-serif;
			color: #eee5e9;
			text-align: center;
			font-size: 1.25em;
			max-width: 800px;

			@media screen and (max-width: 1024px) {
				font-size: 1.25rem;
			}

			@media screen and (max-width: 600px) {
				font-size: 1rem;
				max-width: 300px;
			}
		}
	}
</style>
