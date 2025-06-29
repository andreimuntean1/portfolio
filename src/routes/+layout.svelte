<script lang="ts">
  import { navigating, page } from "$app/stores";

  let route: string;
  let scrollY: number;

  $: navigating && (route = $page.url.pathname);
</script>

<svelte:head>
  <link rel="preload" as="image" href="figma-icon.svg" />
  <link rel="preload" as="image" href="github-icon.svg" />
  <link rel="preload" as="image" href="profile.jpg" />
  <link rel="preload" as="image" href="github-icon.svg" />
  <link rel="preload" as="image" href="linkedin-icon.svg" />
</svelte:head>
<div class="container noise">
  <nav class:scrolled={scrollY > 0}>
    <a href="/" class="logo">am</a>
    <ul>
      <li class:active={route === "/#work"}><a href="#work">Work</a></li>
      <li class:active={route === "/#about"}><a href="#about">About</a></li>
    </ul>
  </nav>
  <section class="content" style="padding-top: 0px;">
    <slot />
  </section>
  <div class="gradients">
    <div class="cyan" />
    <div class="orange" />
  </div>
</div>
<svelte:window bind:scrollY />

<style lang="scss">
  :global(*) {
    margin: 0;
  }

  :global(body) {
    padding: 0;
    box-sizing: border-box;
    min-height: 100dvh;
  }

  .container {
    color: white;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 100dvh;

    &:has(nav.scrolled) {
      padding: 0;
    }

    & > :not(.gradients) {
      z-index: 20;
    }

    nav {
      position: sticky;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 70px 130px 0 130px;
      transition: padding 0.5s;

      @media screen and (max-width: 1024px) {
        padding: 40px 80px;
      }

      @media screen and (max-width: 600px) {
        padding: 30px 40px;
      }

      @media screen and (max-width: 280px) {
        padding: 20px 30px;
      }

      &.scrolled {
        background-color: rgba(0, 11, 20, 0.4);
        backdrop-filter: blur(20px);
        padding: 30px 130px;
        z-index: 25;

        @media screen and (max-width: 1024px) {
          padding: 25px 80px;
        }

        @media screen and (max-width: 600px) {
          padding: 20px 40px;
        }

        @media screen and (max-width: 280px) {
          padding: 15px 30px;
        }
      }

      a.logo {
        font-family: "Caudex", serif;
        font-size: 1.5rem;
        color: white;
        text-decoration: none;

        @media screen and (max-width: 280px) {
          font-size: 1.25rem;
        }

        &:hover {
          text-decoration: underline;
        }
      }

      ul {
        font-family: "Onest", sans-serif;
        display: flex;
        gap: 48px;

        @media screen and (max-width: 600px) {
          gap: 32px;
        }

        @media screen and (max-width: 280px) {
          gap: 20px;
        }

        li {
          list-style-type: none;
          font-size: 1.25rem;

          a {
            color: white;
            text-decoration: none;

            @media screen and (max-width: 600px) {
              font-size: 1rem;
            }

            @media screen and (max-width: 280px) {
              font-size: 0.875rem;
            }
          }

          &:hover,
          &.active {
            text-decoration: underline;
          }
        }
      }
    }

    section.content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 70px 130px;

      @media screen and (max-width: 1024px) {
        padding: 50px 80px;
      }

      @media screen and (max-width: 600px) {
        padding: 40px 60px;
      }

      @media screen and (max-width: 480px) {
        padding: 30px;
      }

      @media screen and (max-width: 280px) {
        padding: 20px;
      }
    }

    .gradients {
      position: fixed;
      width: 100dvw;
      height: 100dvh;
      top: 0;
      left: 0;
      overflow: hidden;

      & > div {
        filter: blur(150px);
        position: absolute;

        &.cyan {
          background: rgba(0, 255, 255, 0.55);
          border-radius: 850px;
          width: 380px;
          height: 380px;
          top: -5%;
          left: -10%;

          @media screen and (max-width: 480px) {
            width: 200px;
            height: 200px;
          }
        }

        &.orange {
          background: rgba(255, 115, 0, 0.55);
          width: 880px;
          height: 270px;
          border-radius: 50%;
          bottom: -25%;
          right: -20%;
        }
      }
    }

    &.noise {
      background: #001b2e;
      background-image: url("https://ik.imagekit.io/andreimuntean/noise.webp");
    }
  }
</style>
