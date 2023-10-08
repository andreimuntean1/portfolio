<script>
	import Project from '../../components/Project.svelte';
	import projects from '../../data/projects.json';
</script>

<svelte:head>
	<title>Andrei Muntean | Work</title>
	<meta name="title" content="Andrei Muntean | Work" />
	<meta
		name="description"
		content="Andrei Muntean is a front-end developer who specializes in building (and occasionally designing) exceptional digital experiences."
	/>

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://andreimuntean.dev" />
	<meta property="og:title" content="Andrei Muntean | Work" />
	<meta
		property="og:description"
		content="Andrei Muntean is a front-end developer who specializes in building (and occasionally designing) exceptional digital experiences."
	/>
	<meta property="og:image" content="https://andreimuntean.dev/thumbnail.png" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://andreimuntean.dev" />
	<meta property="twitter:title" content="Andrei Muntean | Work" />
	<meta
		property="twitter:description"
		content="Andrei Muntean is a front-end developer who specializes in building (and occasionally designing) exceptional digital experiences."
	/>
	<meta
		property="twitter:image"
		content="https://andreimuntean.dev/thumbnail.png"
	/>
</svelte:head>
<div class="projects">
	{#each projects as project}
		<Project {...project} />
	{/each}
</div>

<style lang="scss">
	:global(html) {
		overflow-x: hidden;
	}

	:global(.gradients) {
		overflow: auto;
		height: 100%;
	}

	.projects {
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 50px;
		z-index: 20;
		padding: 60px 0;

		@media screen and (max-width: 280px) {
			gap: 40px;
			padding: 30px 0;
		}
	}
</style>
