<script lang="ts">
  import Project from "../components/Project.svelte";
  import projects from "../data/projects.json";
  import { browser } from "$app/environment";

  let resumeLink: string;
  let years = new Date().getFullYear() - 2021;

  browser &&
    (navigator.language === "ro"
      ? (resumeLink = "https://cv.andreimuntean.dev")
      : (resumeLink = "https://resume.andreimuntean.dev"));
</script>

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
  <meta property="twitter:title" content="Andrei Muntean | Front-end developer" />
  <meta
    property="twitter:description"
    content="Andrei Muntean is a front-end developer who specializes in building (and occasionally designing) exceptional digital experiences."
  />
  <meta property="twitter:image" content="https://andreimuntean.dev/thumbnail.png" />
</svelte:head>
<section class="ptf hero center">
  <div class="hero-content">
    <h1>
      <span>Hi, I’m</span>
      <br />
      Andrei Muntean
    </h1>
    <p>Front-end developer by focus, full-stack by experience, and web designer when it matters.</p>
  </div>
</section>
<section class="ptf projects" id="work">
  <div class="projects">
    {#each projects as project}
      <Project {...project} />
    {/each}
  </div>
</section>
<section class="ptf about center" id="about">
  <div class="container about">
    <img
      src="profile.jpg"
      alt="Andrei in the woods, smiling, wearing a light blue suit, white shirt and navy blue tie"
    />
    <div class="content">
      <p>
        I'm a self-taught developer based in Bucharest, Romania. While I specialize in front-end development, I'm also
        loving the challenges brought by fullstack development. My main frameworks are React and Vue, and I've been
        growing increasingly passionate about Svelte too. WordPress hasn't escaped my attention either, as I've recently
        gotten a solid grasp of it.
        <br /><br />
        I love building things for the web. There's something really exciting about starting from a blank file and turning
        it into something meaningful. My journey began about {years} years ago, during the COVID-19 pandemic, and my enthusiasm
        has only grown since.
        <br /><br />
        Feel free to check out my resume to see what other technologies I've worked with, or just reach out using the button
        below. I'll do my best to get back to you as soon as possible!
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
</section>

<style lang="scss">
  :global(html) {
    scroll-behavior: smooth;
    scroll-padding-top: 20px;
  }

  :global(*) {
    margin: 0;
  }

  :global(body) {
    padding: 0;
    box-sizing: border-box;
  }

  section.ptf {
    width: 100%;
    min-height: 100dvh;

    &.center {
      display: flex;
      align-items: start;
      justify-content: center;
    }

    .hero-content {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      flex: 1;
      min-height: 73dvh;

      h1 {
        font-family: "Caudex", serif;
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
          font-family: "Onest", sans-serif;
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
    }

    p {
      font-family: "Onest", sans-serif;
      color: #eee5e9;
      font-size: 1.5rem;
      max-width: 500px;

      .hero-content p {
        text-align: center;
      }

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

    .projects {
      width: 100%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 50px;
      z-index: 20;
      padding: 90px 0 60px 0;

      @media screen and (max-width: 280px) {
        gap: 40px;
        padding: 30px 0;
      }
    }

    &.about {
      margin-top: 30px;
      .container.about {
        display: flex;
        min-height: 100dvh;
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
            max-height: 200px;
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
            font-family: "Onest", sans-serif;
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
              font-family: "Onest", sans-serif;
              font-weight: 700;

              @media screen and (max-width: 280px) {
                gap: 16px;
              }

              a {
                height: min-content;
                padding: 10px 30px;
                border-radius: 35px;
                font-size: 0.875rem;
                transition:
                  transform 0.5s,
                  color 0.5s,
                  background 0.5s;
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
    }
  }
</style>
