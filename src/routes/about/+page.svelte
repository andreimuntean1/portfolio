<script lang="ts">
	import { browser } from '$app/environment';

	let resumeLink: string;
	let years = new Date().getFullYear() - 2020;

	browser &&
		(navigator.language === 'ro'
			? (resumeLink = 'https://cv.andreimuntean.dev')
			: (resumeLink = 'https://resume.andreimuntean.dev'));
</script>

<svelte:head>
	<title>Andrei Muntean | About</title>
	<meta name="title" content="Andrei Muntean | About" />
	<meta
		name="description"
		content="More about Andrei Muntean and his passion"
	/>

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://andreimuntean.dev" />
	<meta property="og:title" content="Andrei Muntean | About" />
	<meta
		property="og:description"
		content="More about Andrei Muntean and his passion"
	/>
	<meta property="og:image" content="https://andreimuntean.dev/thumbnail.png" />

	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://andreimuntean.dev" />
	<meta property="twitter:title" content="Andrei Muntean | About" />
	<meta
		property="twitter:description"
		content="More about Andrei Muntean and his passion"
	/>
	<meta
		property="twitter:image"
		content="https://andreimuntean.dev/thumbnail.png"
	/>
</svelte:head>
<div class="container">
	<img src="profile.jpg" alt="Andrei in the woods, wearing a beige sweater" />
	<div class="content">
		<p>
			I'm a self-taught developer near Cluj-Napoca, Romania, specializing in
			front-end but interested in fullstack too. I really enjoy creating things
			on the web, because it feels great to know that I can create somthing big
			starting from just a blank file. My passion started about {years} years ago,
			during the COVID-19 pandemic, and kept growing ever since. I mainly work in
			React, but recently I began to love Svelte. Check my resume if you're curious
			what other technologies I work with, or hit me up on the button below. I'll
			do my best to get back asap to you!
		</p>
		<div class="buttons">
			<div class="contact">
				<a href="mailto:contact@andreimuntean.dev">Get in touch</a>
				<a href={resumeLink}>See resume</a>
			</div>
			<div class="socials">
				<a href="https://www.linkedin.com/in/andreimuntean1" target="_blank">
					<img src="linkedin-icon.svg" alt="LinkedIn icon" />
				</a>
				<a href="https://github.com/andreimuntean1" target="_blank">
					<img src="github-icon.svg" alt="Github icon" />
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
		flex: 1;
		gap: 60px;
		z-index: 5;

		@media screen and (max-width: 900px) {
			flex-direction: column;
			margin-top: 75px;
		}

		@media screen and (max-width: 280px) {
			margin-top: 30px;
			gap: 30px;
		}

		& > img {
			width: auto;
			max-height: 300px;
			border-radius: 35px;

			@media screen and (max-width: 900px) {
				border-radius: 50%;
			}

			@media screen and (max-width: 280px) {
				width: 100%;
				height: auto;
				max-height: unset;
				max-width: 150px;
			}
		}

		.content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			gap: 50px;

			@media screen and (max-width: 1200px) {
				gap: 40px;
			}

			@media screen and (max-width: 280px) {
				gap: 28px;
			}

			p {
				color: rgba(255, 255, 255, 0.75);
				font-family: 'Onest', sans-serif;
				font-size: 1.25rem;
				max-width: 600px;

				@media screen and (max-width: 600px) {
					font-size: 1rem;
					line-height: 1.4;
				}

				@media screen and (max-width: 280px) {
					font-size: 0.875rem;
				}
			}

			.buttons {
				display: flex;
				justify-content: space-between;

				@media screen and (max-width: 1200px) {
					flex-direction: column;
				}

				.contact {
					display: flex;
					gap: 30px;
					font-family: 'Onest', sans-serif;
					font-weight: 700;

					@media screen and (max-width: 280px) {
						gap: 16px;
					}

					a {
						height: min-content;
						padding: 10px 30px;
						border-radius: 35px;
						font-size: 0.875rem;
						transition: transform 0.5s, color 0.5s, background 0.5s;
						transform-origin: center;
						text-decoration: none;

						@media screen and (max-width: 768px) {
							font-size: 1rem;
						}

						@media screen and (max-width: 280px) {
							font-size: 0.75rem;
							padding: 8px 20px;
						}

						&:nth-child(1) {
							background: #d9d9d9;
							color: black;

							&:hover {
								background: white;
							}
						}

						&:nth-child(2) {
							background: rgba(0, 6, 10, 0.5);
							color: rgba(255, 255, 255, 0.65);

							&:hover {
								color: white;
							}
						}

						&:hover {
							transform: scale(1.2);
						}
					}
				}

				.socials {
					display: flex;
					gap: 32px;

					@media screen and (max-width: 1200px) {
						gap: 16px;
						margin-top: 38px;
						margin-left: 3px;
					}

					img {
						height: 24px;

						@media screen and (max-width: 280px) {
							height: 16px;
						}
					}

					a {
						opacity: 0.75;
						transition: opacity 0.3s;

						&:hover {
							opacity: 1;
						}
					}
				}
			}
		}
	}
</style>
