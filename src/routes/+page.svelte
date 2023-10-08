<svelte:head>
	<title>Andrei Muntean | Front-end developer</title>
	<meta name="title" content="Andrei Muntean | Front-end developer" />
	<meta
		name="description"
		content="Andrei Muntean is a front-end developer who specializes in building (and occasionally designing) exceptional digital experiences."
	/>

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://andreimuntean.dev" />
	<meta property="og:title" content="Andrei Muntean | Front-end developer" />
	<meta
		property="og:description"
		content="Andrei Muntean is a front-end developer who specializes in building (and occasionally designing) exceptional digital experiences."
	/>
	<meta property="og:image" content="https://andreimuntean.dev/thumbnail.png" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://andreimuntean.dev" />
	<meta
		property="twitter:title"
		content="Andrei Muntean | Front-end developer"
	/>
	<meta
		property="twitter:description"
		content="Andrei Muntean is a front-end developer who specializes in building (and occasionally designing) exceptional digital experiences."
	/>
	<meta
		property="twitter:image"
		content="https://andreimuntean.dev/thumbnail.png"
	/>
</svelte:head>
<div class="content">
	<h1>
		<span>Hi, I am</span>
		<br />
		Andrei Muntean
	</h1>
	<p>
		Usually a front-end developer, sometimes a full-stack one, sometimes a web
		designer.
	</p>
</div>

<style lang="scss">
	:global(*) {
		margin: 0;
	}

	:global(body) {
		padding: 0;
		box-sizing: border-box;
	}

	.content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		text-align: center;
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

			@media screen and (max-width: 280px) {
				font-size: 1.75rem;
				margin-bottom: 10px;
			}

			span {
				font-family: 'Onest', sans-serif;
				font-weight: 500;
				color: rgba(238, 229, 233, 0.75);
				font-size: 1.5rem;

				@media screen and (max-width: 1024px) {
					font-size: 1.25rem;
				}

				@media screen and (max-width: 280px) {
					font-size: 1rem;
				}
			}
		}

		p {
			font-family: 'Onest', sans-serif;
			color: #eee5e9;
			text-align: center;
			font-size: 1.5rem;
			max-width: 500px;

			@media screen and (max-width: 1024px) {
				font-size: 1.25rem;
			}

			@media screen and (max-width: 600px) {
				font-size: 1rem;
				max-width: 350px;
			}

			@media screen and (max-width: 280px) {
				font-size: 0.875rem;
				min-width: 250px;
			}
		}
	}
</style>
