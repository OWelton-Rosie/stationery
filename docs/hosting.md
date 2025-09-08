# Hosting your customised app
Due to its purely static nature, any hosting provider will be able to host your customised app.

The original ([https://stationery.oweltonrosie.com](https://stationery.oweltonrosie.com)) is hosted via [Cloudflare pages](https://pages.cloudflare.com/), but [GitHub pages](https://docs.github.com/en/pages), [Netlify](https://www.netlify.com/) and [Vercel](https://vercel.com/) are all popular options. I have only used Cloudflare Pages, so cannot vouch for any of the others.

Once you've chosen a hosting provider, some things to note:
- Make sure that you select the root directory to `src`, otherwise your provider will be unable to find and serve the assets of your app.
- Check whether or not your provider allows for automatic deployments. If it doesn't, you will need to redeploy after each commit.
