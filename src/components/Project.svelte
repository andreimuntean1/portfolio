<script lang="ts">
  interface Links {
    demo?: string;
    demoLabel?: string;
    secondary?: string;
    secondaryLabel?: string;
    figma?: string;
    github?: string;
  }

  export let title: string,
    description: string,
    links: Links,
    wip: boolean = false;
</script>

<div class="project">
  {#if wip}
    <div class="wip-overlay">Coming soon</div>
  {/if}
  <div class="title">
    <h2>{title}</h2>
  </div>
  <p>{description}</p>
  {#if links.demo || links.secondary || links.figma || links.github}
    <div class="buttons">
      <div class="actions">
        {#if links.demo}
          <a href={links.demo} target="_blank" class="live">{links.demoLabel ?? "See live"}</a>
        {/if}
        {#if links.secondary}
          <a href={links.secondary} target="_blank" class="secondary">{links.secondaryLabel ?? "See more"}</a>
        {/if}
      </div>
      <div class="source">
        {#if links.figma}
          <a href={links.figma} target="_blank">
            <img src="figma-icon.svg" alt="Figma icon" />
          </a>
        {/if}
        {#if links.github}
          <a href={links.github} target="_blank">
            <img src="github-icon.svg" alt="Github icon" />
          </a>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .project {
    background-color: rgba(0, 11, 20, 0.5);
    backdrop-filter: blur(20px);
    padding: 40px;
    aspect-ratio: 9 / 4;
    max-width: 360px;
    border-radius: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .wip-overlay {
      opacity: 0%;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 11, 20, 0.9);
      backdrop-filter: blur(40px);
      color: rgba($color: #fff, $alpha: 0.5);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 20;
      border-radius: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75em;
      font-family: "Onest", serif;
      letter-spacing: 3px;
      transition: opacity 0.3s;

      &:hover {
        opacity: 100%;
      }

      @media screen and (max-width: 600px) {
        border-radius: 25px;
      }

      @media screen and (max-width: 280px) {
        border-radius: 15px;
        font-size: 1.25rem;
        letter-spacing: normal;
      }
    }

    @media screen and (max-width: 600px) {
      width: 100%;
      max-width: unset;
      height: auto;
      padding: 30px;
      border-radius: 25px;
    }

    @media screen and (max-width: 280px) {
      padding: 20px;
      border-radius: 15px;
    }

    .title {
      display: flex;
      align-items: center;
      gap: 15px;

      @media screen and (max-width: 600px) {
        align-items: start;
        gap: 5px;
        flex-direction: column;
      }

      h2,
      h3 {
        font-size: 1.75rem;
      }

      h2 {
        font-family: "Caudex", serif;

        @media screen and (max-width: 280px) {
          font-size: 1.25rem;
        }
      }

      h3 {
        font-family: "Onest", sans-serif;
        opacity: 0.25;

        @media screen and (max-width: 600px) {
          font-size: 1.25rem;
        }

        @media screen and (max-width: 280px) {
          font-size: 0.875rem;
        }
      }
    }

    p {
      margin: 20px 0 30px;
      font-family: "Onest", sans-serif;

      @media screen and (max-width: 600px) {
        font-size: 0.9rem;
      }

      @media screen and (max-width: 280px) {
        margin: 15px 0 25px;
        font-size: 0.75rem;
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: fit-content;
      gap: 16px;

      .actions {
        display: flex;
        align-items: center;
        gap: 12px;

        // Two buttons in one card need tighter padding so the hover growth
        // still fits inside the card.
        &:has(.secondary) a {
          padding: 7px 22px;

          &:hover {
            padding: 10px 28px;
          }

          @media screen and (max-width: 280px) {
            padding: 6px 16px;

            &:hover {
              padding: 8px 20px;
            }
          }
        }
      }

      a.secondary {
        background: rgba(0, 6, 10, 0.5);
        color: rgba(255, 255, 255, 0.65);
        height: min-content;
        padding: 7px 36px;
        border-radius: 35px;
        font-size: 0.875rem;
        font-family: "Onest", sans-serif;
        font-weight: 700;
        text-decoration: none;
        transition:
          padding 0.3s,
          color 0.3s;
        white-space: nowrap;

        @media screen and (max-width: 280px) {
          font-size: 0.75rem;
          padding: 6px 24px;
        }

        &:hover {
          color: white;
        }
      }

      a.live {
        white-space: nowrap;
        background: #d9d9d9;
        height: min-content;
        padding: 7px 36px;
        color: black;
        border-radius: 35px;
        font-size: 0.875rem;
        font-family: "Onest", sans-serif;
        font-weight: 700;
        text-decoration: none;
        transition: padding 0.3s;

        @media screen and (max-width: 280px) {
          font-size: 0.75rem;
          padding: 6px 24px;
        }

        &:hover {
          padding: 12px 48px;

          @media screen and (max-width: 280px) {
            padding: 10px 30px;
          }
        }
      }

      .source {
        display: flex;
        gap: 20px;

        @media screen and (max-width: 280px) {
          gap: 14px;
        }

        a {
          opacity: 0.75;
          transition: opacity 0.3s;

          &:hover {
            opacity: 1;
          }

          img {
            height: 20px;

            @media screen and (max-width: 280px) {
              height: 16px;
            }
          }
        }
      }
    }
  }
</style>
